"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eth_getLogs = exports.eth_getTransactionByHash = void 0;
// import web3lib from "web3";
// import { notImplemented } from "./utils.js";
// import { hexToNumber, block } from "../utils/index.js";
// import { ClientError } from "../../errors.js";
var getTransaction_js_1 = require("./getTransaction.js");
Object.defineProperty(exports, "eth_getTransactionByHash", { enumerable: true, get: function () { return getTransaction_js_1.eth_getTransactionByHash; } });
const index_js_1 = require("../utils/index.js");
const ethAddress = require("../utils/address.js");
const blockNumToHash_js_1 = __importDefault(require("../utils/blockNumToHash.js"));
const p_limit_1 = __importDefault(require("p-limit"));
const promise_retry_1 = __importDefault(require("promise-retry"));
const debug_1 = __importDefault(require("debug"));
const debug = debug_1.default("java-tron-provider");
/*
{
  jsonrpc: '2.0',
  method: 'eth_getLogs',
  params: [
    {
      address: '0x8da1d4aba6ddf047dedd412388d9e844ad8f9728',
      fromBlock: '0x0',
      toBlock: '0x0',
      topics: [
        [
          '0x9ab3aefb2ba6dc12910ac1bce4692cf5c3c0d06cff16327c64a3ef78228b130b',
          '0x76571b7a897a1509c641587568218a290018fbdc8b9a724f17b77ff0eec22c0c'
        ]
      ]
    }
  ],
  id: 2747
}
*/
// TODO: refactor to use utils/transactionReceipt.js fromTronLog?
const tronTxInfoToEthLogs = (txInfo, txIndex) => {
    return txInfo.log.map((log, idx) => ({
        address: ethAddress.fromTronHex(txInfo.contract_address),
        // TODO: blockHash not on txInfo...
        // blockHash: txInfo.
        blockNumber: index_js_1.numberToHex(txInfo.blockNumber),
        data: `0x${log.data}`,
        logIndex: index_js_1.numberToHex(idx),
        removed: false,
        topics: log.topics.map((t) => `0x${t}`),
        transactionHash: `0x${txInfo.id}`,
        transactionIndex: index_js_1.numberToHex(txIndex),
    }));
};
const getLogsForBlockNum = async (blockNum, ctx) => {
    const { data } = await ctx.tronClient.post("/wallet/gettransactioninfobyblocknum", {
        num: blockNum,
    });
    // block 0 returns {} instead of [] ....
    if (!Array.isArray(data)) {
        return [];
    }
    return data
        .filter((d) => d.log && d.log.length > 0)
        .map(tronTxInfoToEthLogs)
        .flat();
};
// handles both variations (by number and by hash)
/**
PARAMS:

FILTER OBJECT
address [optional] - a string representing the address (20 bytes) to check for balance
fromBlock [optional, default is "earliest"] - an integer block number, or the string "latest", "earliest" or "pending"
toBlock [optional, default is "latest"] - an integer block number, or the string "latest", "earliest" or "pending"
topics[optional] - Array of 32 Bytes DATA topics. Topics are order-dependent.
blockhash:[optional] With the addition of EIP-234, blockHash restricts the logs returned to the single block with the 32-byte hash blockHash. Using blockHash is equivalent to fromBlock = toBlock = the block number with hash blockHash. If blockHash is present in in the filter criteria, then neither fromBlock nor toBlock are allowed.

RESPONSE
RESULT FIELDS
LOG OBJECTS - An array of log objects, or an empty array if nothing has changed since last poll.

logs are objects with following params:
removed: true when the log was removed, due to a chain reorganization. false if it's a valid log.
logIndex: integer of the log index position in the block. null when its pending log.
transactionIndex: integer of the transactions index position log was created from. null when its pending log.
transactionHash: 32 Bytes - hash of the transactions this log was created from. null when its pending log.
blockHash: 32 Bytes - hash of the block where this log was in. null when its pending. null when its pending log.
blockNumber: the block number where this log was in. null when its pending. null when its pending log.
address: 20 Bytes - address from which this log originated.
data: contains one or more 32 Bytes non-indexed arguments of the log.
topics: Array of 0 to 4 32 Bytes of indexed log arguments. (In solidity: The first topic is the hash of the signature of the event (e.g. Deposit(address,bytes32,uint256)), except you declared the event with the anonymous specifier.)
BODY
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": [
    {
      "address": "0x1a94fce7ef36bc90959e206ba569a12afbc91ca1",
      "blockHash": "0x7c5a35e9cb3e8ae0e221ab470abae9d446c3a5626ce6689fc777dcffcab52c70",
      "blockNumber": "0x5c29fb",
      "data": "0x0000000000000000000000003e3310720058c51f0de456e273c626cdd35065700000000000000000000000000000000000000000000000000000000000003185000000000000000000000000000000000000000000000000000000000000318200000000000000000000000000000000000000000000000000000000005c2a23",
      "logIndex": "0x1d",
      "removed": false,
      "topics": [
        "0x241ea03ca20251805084d27d4440371c34a0b85ff108f6bb5611248f73818b80"
      ],
      "transactionHash": "0x3dc91b98249fa9f2c5c37486a2427a3a7825be240c1c84961dfb3063d9c04d50",
      "transactionIndex": "0x1d"
    },
    {
      "address": "0x06012c8cf97bead5deae237070f9587f8e7a266d",
      "blockHash": "0x7c5a35e9cb3e8ae0e221ab470abae9d446c3a5626ce6689fc777dcffcab52c70",
      "blockNumber": "0x5c29fb",
      "data": "0x00000000000000000000000077ea137625739598666ded665953d26b3d8e374400000000000000000000000000000000000000000000000000000000000749ff00000000000000000000000000000000000000000000000000000000000a749d00000000000000000000000000000000000000000000000000000000005c2a0f",
      "logIndex": "0x57",
      "removed": false,
      "topics": [
        "0x241ea03ca20251805084d27d4440371c34a0b85ff108f6bb5611248f73818b80"
      ],
      "transactionHash": "0x788b1442414cb9c9a36dba2abe250763161a6f6395788a2e808f1b34e92beec1",
      "transactionIndex": "0x54"
    }
  ]
}
*/
// inclusive range
// range(2,5) => [2,3,4,5]
const range = (start, end) => {
    const length = end - start + 1;
    return Array.from({ length }, (x, i) => i + start);
};
// returns true if the two arrays have at least one element in common
const intersects = (array1, array2) => {
    return array1.filter((ele) => array2.includes(ele)).length > 0;
};
exports.eth_getLogs = async ([filterObject], ctx) => {
    // console.dir({ filterObject }, { depth: null });
    const { address, fromBlock = "earliest", toBlock = "latest", topics = [], } = filterObject;
    // TODO: handle "latest", "ealiest" and "pending" for fromBlock and toBlock
    const fromBlockNum = index_js_1.hexToNumber(fromBlock);
    const toBlockNum = index_js_1.hexToNumber(toBlock);
    // console.log({ fromBlockNum, toBlockNum });
    const blockRange = range(fromBlockNum, toBlockNum);
    // limit concurrency...
    const limit = p_limit_1.default(3);
    // TODO: auto retry failed requests?
    const logs = (await Promise.all(blockRange.map(async (blockNum) => {
        try {
            return promise_retry_1.default(async (retry, attempt) => {
                try {
                    if (attempt > 1) {
                        debug(`Attempt #${attempt} to get logs for block ${blockNum}`);
                    }
                    const [blockLogs, blockHash] = await Promise.all([
                        limit(() => getLogsForBlockNum(blockNum, ctx)),
                        limit(() => blockNumToHash_js_1.default(blockNum, ctx)),
                    ]);
                    // add blockHash to log results...
                    return blockLogs.map((l) => {
                        return { ...l, blockHash: `0x${blockHash}` };
                    });
                }
                catch (err) {
                    retry(err);
                }
            }, { retries: 4 });
        }
        catch (err) {
            throw new Error(`error getting logs for block ${blockNum}: ${err.message}`);
        }
    }))).flat();
    // console.dir({ logs }, { depth: null });
    const filteredLogs = logs
        // by topics
        .filter((l) => {
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
        if (!topics.length)
            return true;
        for (let i = 0; i < topics.length; i++) {
            const topic = topics[i];
            if (topic === null)
                continue;
            if (Array.isArray(topic)) {
                if (topic.includes(l.topics[i]))
                    continue;
                return false;
            }
            if (l.topics[i] === topic) {
                continue;
            }
            return false;
        }
        return true;
    })
        // by address
        .filter((l) => {
        if (address) {
            return l.address === address;
        }
        return true;
    });
    // console.dir({ filteredLogs }, { depth: null });
    return filteredLogs;
};
