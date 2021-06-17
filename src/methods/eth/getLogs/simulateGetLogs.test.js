import test from "ava";
// import * as eth_ from "../index.js";
import simulateGetLogs_ from "./simulateGetLogs.js";
import autoRety from "../../autoRetry.js";
import { numberToHex } from "../../utils/index.js";
import { createContext } from "../../../index.js";

const simulateGetLogs = autoRety(simulateGetLogs_);

// priv key: 52087001767e9c30288232baa07d3ac5cf0e3c8de30a49b98424ccf9b92e2dfd

const context = createContext({ network: "shasta" });

test("eth_getLogs block 0", async (t) => {
  const res = await simulateGetLogs(
    [
      {
        address: "0x8da1d4aba6ddf047dedd412388d9e844ad8f9728",
        fromBlock: "0x0",
        toBlock: "0x0",
        topics: [
          [
            "0x9ab3aefb2ba6dc12910ac1bce4692cf5c3c0d06cff16327c64a3ef78228b130b",
            "0x76571b7a897a1509c641587568218a290018fbdc8b9a724f17b77ff0eec22c0c",
          ],
        ],
      },
    ],
    context
  );

  t.deepEqual(res, []);
});

const expectedLogs = [
  {
    address: "0x7090190c41ba59f763e2cbe7d885e007e94be5d2",
    blockNumber: numberToHex(6745405),
    data:
      "0x000000000000000000000000000000000000000000000000000000051fc79c9c000000000000000000000000000000000000000000000000000000000700e7fc0000000000000000000000000000000000000000000000000000000006fed77701000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000",
    logIndex: "0x0",
    removed: false,
    topics: [
      "0xbaca790fd027b9b7f36b90c3084718a3a039693cdf83844342f5f1edc839c3af",
    ],
    transactionHash:
      "0x53febf983f599f96c46c5163d1ca380d217069851e0c041b0eb5f7531f5d2e72",
    transactionIndex: "0x0",
    blockHash:
      "0x000000000066ed3ddce9ddafebec7ed968ebebf2afceb57768306927166974b1",
  },
  {
    address: "0x79c23a5666042e40420d6afdc1541e3926205eba",
    blockNumber: numberToHex(6745405),
    data: "0x000000000000000000000000000000000000000000000000000000051fc79c9c",
    logIndex: "0x0",
    removed: false,
    topics: [
      "0x678ae61fcbde3426947a5076f2541a6705fa78577e819a420c826e9c722ff792",
    ],
    transactionHash:
      "0x9143f172be209de3448e39c3a777188579610e6f63497d9a62392e546a853636",
    transactionIndex: "0x1",
    blockHash:
      "0x000000000066ed3ddce9ddafebec7ed968ebebf2afceb57768306927166974b1",
  },
  {
    address: "0x57e90973c3541d5298149f0ddc947e95006950ba",
    blockNumber: numberToHex(6745405),
    data:
      "0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000039e63f8d70becdaba64a45091688a8446d57689000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000044361726c00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002968747470733a2f2f74686567726170682e636f6d2f696d672f7465616d2f7465616d5f30342e706e670000000000000000000000000000000000000000000000",
    logIndex: "0x0",
    removed: false,
    topics: [
      "0x9ab3aefb2ba6dc12910ac1bce4692cf5c3c0d06cff16327c64a3ef78228b130b",
    ],
    transactionHash:
      "0xcdf5550b14611081cdaf795f995bafaa4f5a5e5d25abc4493d3f4ab42205c870",
    transactionIndex: "0x2",
    blockHash:
      "0x000000000066ed3ddce9ddafebec7ed968ebebf2afceb57768306927166974b1",
  },
  {
    address: "0x57e90973c3541d5298149f0ddc947e95006950ba",
    blockNumber: numberToHex(6745406),
    data:
      "0x0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000039e63f8d70becdaba64a45091688a8446d57689000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000054c75636173000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002a68747470733a2f2f74686567726170682e636f6d2f696d672f7465616d2f62775f4c756361732e6a706700000000000000000000000000000000000000000000",
    logIndex: "0x0",
    removed: false,
    topics: [
      "0x9ab3aefb2ba6dc12910ac1bce4692cf5c3c0d06cff16327c64a3ef78228b130b",
    ],
    transactionHash:
      "0x272ce910d0c78a06bdba394969d82ab7523edec12ac2363e8035f253b8ebb6c5",
    transactionIndex: "0x0",
    blockHash:
      "0x000000000066ed3e919a7121a3c5c40e4f050d2b1363cb2f943346e51c5f67a8",
  },
];

// https://shasta.tronscan.org/#/contract/THz2xSKyT4qyngdvq2pWFa7E4uTcxjwWqG
test("eth_getLogs block 6745405-6745406", async (t) => {
  const res = await simulateGetLogs(
    [
      {
        fromBlock: numberToHex(6745405),
        toBlock: numberToHex(6745406),
      },
    ],
    context
  );

  t.deepEqual(res, expectedLogs);
});

test("eth_getLogs block 6745405-6745406 filtered by address", async (t) => {
  const address = "0x57e90973c3541d5298149f0ddc947e95006950ba";
  const res = await simulateGetLogs(
    [
      {
        address,
        fromBlock: numberToHex(6745405),
        toBlock: numberToHex(6745406),
      },
    ],
    context
  );

  t.deepEqual(
    res,
    expectedLogs.filter((log) => log.address === address)
  );
});

test("eth_getLogs block 6745405-6745406 filtered by topics", async (t) => {
  const topics = [
    [
      "0x9ab3aefb2ba6dc12910ac1bce4692cf5c3c0d06cff16327c64a3ef78228b130b",
      "0x76571b7a897a1509c641587568218a290018fbdc8b9a724f17b77ff0eec22c0c",
    ],
  ];
  const res = await simulateGetLogs(
    [
      {
        topics,
        fromBlock: numberToHex(6745405),
        toBlock: numberToHex(6745406),
      },
    ],
    context
  );

  t.deepEqual(res, [expectedLogs[2], expectedLogs[3]]);
});
