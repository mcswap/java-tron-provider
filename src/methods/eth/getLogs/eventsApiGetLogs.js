import qs from "querystring";
import { hexToNumber, numberToHex, address as ethAddress } from "../../utils/index.js";

function buildUrl(filterObject, { page = 1, limit = 200 } = {}) {
  const opts = {
    limit, // actual API limit is 200
    start: page,
    sort: "timeStamp",
  };
  if (Number.isInteger(filterObject.fromBlock)) {
    opts.block = filterObject.fromBlock;
  }
  const filterByContractAddress = () => {
    if (filterObject.contractAddress) {
      return `/contract/${ethAddress.toTron(filterObject.contractAddress)}`;
    }
    return "";
  };
  return [
    "/contractlogs",
    filterByContractAddress(),
    "?",
    qs.stringify(opts),
  ].join("");
}

/*
tron log looks like:

{
    topicList: [
      '7d2476ab50663f025cff0be85655bcf355f62768615c0c478f3cd5293f807365',
      '00000000000000000000000095486da9b24333a15da61d4a9a2cc8f4698c6346',
      '000000000000000000000000f27dbe165935952b8cd6eb59e311ad2f4edda727',
      '00000000000000000000000000000000000000000000000000000000001e8480'
    ],
    data: '00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000',
    transactionId: 'f7b03d9826b118b67b40ac268ec6b6e383dbc0d5e6e78d91c2183f364904811a',
    contractAddress: 'TXxHX7T6yqnacQXMPGfoe3fZkpDS5tTubh',
    callerAddress: '',
    originAddress: 'TBHtcryJWP9bnTppLJVBTUppfaA4iUtSqH',
    creatorAddress: 'TL5aSRVg1NYuGCxrxysRUGSyi562qJrMrG',
    blockNumber: 8584510,
    removed: 'false',
    latestSolidifiedBlockNumber: 0,
    timeStamp: 1598582277000,
    triggerName: 'contractLogTrigger',
    uniqueId: 'f7b03d9826b118b67b40ac268ec6b6e383dbc0d5e6e78d91c2183f364904811a_5',
    abiString: null,
    rawData: {
      address: 'f1261f72f21acf862f1bbc78138e7dade797dafb',
      topics: [Array],
      data: '00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000'
    }
  },
*/
function fromTronLog(tronLog, idx) {
  return {
    address: ethAddress.fromTron(tronLog.contractAddress),
    blockNumber: numberToHex(tronLog.blockNumber),
    data: `0x${tronLog.data}`,
    // TODO: that will give the index in tron api response not in block, oops
    logIndex: numberToHex(idx),
    removed: false, // todo: dont think this is ever true in Tron?
    topics: tronLog.topicList.map((t) => `0x${t}`),
    transactionHash: `0x${tronLog.transactionId}`,
    // TODO: that will give the index in tron api response not in transaction, oops
    transactionIndex: numberToHex(idx),
  };
}

// TODO: move to utils and share with simulatedGetLogs
function createTopicFilter(topics) {
  return (log) => {
    /*
      // https://eth.wiki/json-rpc/API#eth_newfilter
      A note on specifying topic filters:
      Topics are order-dependent. A transaction with a log with topics [A, B]
      will be matched by the following topic filters:

      [] “anything”
      [A] “A in first position (and anything after)”
      [null, B] “anything in first position AND B in second position (and anything after)”
      [A, B] “A in first position AND B in second position (and anything after)”
      [[A, B], [A, B]] “(A OR B) in first position AND (A OR B) in second position (and anything after)”
    */
    if (!topics.length) return true;
    for (let i = 0; i < topics.length; i++) {
      const topic = topics[i];
      if (topic === null) continue;
      if (Array.isArray(topic)) {
        if (topic.includes(log.topics[i])) continue;
        return false;
      }
      if (log.topics[i] === topic) {
        continue;
      }
      return false;
    }
    return true;
  };
}

function parseTopics(topics = []) {
  const allTopics = topics
    .flat()
    .flat()
    .filter((e) => !!e);

  return { topicFilter: createTopicFilter(topics), allTopics };
}

// TODO: move to utils and share with simulatedGetLogs
function parseFilterObject(filterObject) {
  // TODO: handle block aliases , e.g. "latest", "pending", "earliest"
  let fromBlock;
  let toBlock;
  let fromAddresses;
  let contractAddress;

  if (filterObject.fromBlock) {
    fromBlock = hexToNumber(filterObject.fromBlock);
  }
  if (filterObject.toBlock) {
    toBlock = hexToNumber(filterObject.toBlock);
  }
  // address: DATA|Array, 20 Bytes - (optional) Contract address or a list of addresses from which logs should originate.
  if (Array.isArray(filterObject.address)) {
    fromAddresses = filterObject.address;
  } else {
    contractAddress = filterObject.address;
  }

  const topics = parseTopics(filterObject.topics);
  return { fromBlock, toBlock, fromAddresses, contractAddress, ...topics };
}

function createBlockFilter(fromBlock = -1, toBlock = Infinity) {
  return (log) => {
    // TODO: are they both inclusive?
    // console.log({ fromBlock, toBlock });
    const blockNumber = hexToNumber(log.blockNumber);
    return blockNumber >= fromBlock && blockNumber <= toBlock;
  };
}

function normalizeData(data) {
  // sometimes responses look like `[...]` and sometimes like `{ data: [...] }`
  if (data.data) {
    return data.data;
  }
  return data;
}

// adds "blockHash" to each object, slow :(
async function withBlockHashes(logs, ctx) {
  // unique block numbers in logs... optimization so only one query for multiple logs with same block number
  const blockNumbers = [
    ...new Set(logs.map((l) => hexToNumber(l.blockNumber))),
  ];
  // blockNumber -> blockHash
  const blockHashes = new Map();

  await Promise.all(
    blockNumbers.map(async (blockNumber) => {
      // TODO: retry logic!
      // TODO: OPTIMIZE: This fetches the block with all transactions! too slow...
      // solution 1) find an API that just queries the block header?
      // solution 2) use streaming json parser and close connection after header received?
      const { data } = await ctx.tronClient.post("/wallet/getblockbynum", {
        num: blockNumber,
      });
      const blockHash = `0x${data.blockID}`;
      blockHashes.set(blockNumber, blockHash);
    })
  );

  return logs.map((l) => {
    const blockNumber = hexToNumber(l.blockNumber);
    return { ...l, blockHash: blockHashes.get(blockNumber) };
  });
}

// API docs: https://github.com/tronprotocol/Documentation/blob/master/English_Documentation/TRON_Event_Subscribe/tron-eventquery.md
// Create gravatar event:
// https://event.nileex.io/contractlogs?limit=1&sort=timeStamp&start=0&block=8577252
export default async function eventsApiGetLogs([filterObject], ctx) {
  const { tronEventsClient: client } = ctx;
  // console.dir(filterObject, { depth: null });

  const filter = parseFilterObject(filterObject);
  let page = 1;

  let results = [];

  while (true) {
    // TODO: auto retry if fail...
    const url = buildUrl(filter, { page });
    // console.log({ url });
    const { data: data_ } = await client.get(url);
    const logs = normalizeData(data_);
    // console.dir({ logs }, { depth: null });

    // empty page... stop iterating
    if (!logs.length) {
      break;
    }

    results = [...results, ...logs];

    if (
      Number.isInteger(filter.toBlock) &&
      logs[logs.length - 1].blockNumber > filter.toBlock
    ) {
      // last log is from a block after the "toBlock" filter, we dont need to fetch more pages...
      break;
    }

    page += 1;
  }
  // TODO: map and filter results...
  const res = results
    .map(fromTronLog)
    .filter(createBlockFilter(filter.fromBlock, filter.toBlock))
    .filter(filter.topicFilter);

  return withBlockHashes(res, ctx);
}
