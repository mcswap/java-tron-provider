import test from "ava";
import * as eth_ from "./index.js";
import { autoRetyAllMethods } from "../autoRetry.js";
import { numberToHex } from "../utils/index.js";
import { createContext } from "../../index.js";

const eth = autoRetyAllMethods(eth_);

// priv key: 52087001767e9c30288232baa07d3ac5cf0e3c8de30a49b98424ccf9b92e2dfd
// const testAccount = ethAddress.fromTron("TAJLmoNzgYHDX5osdfa3c5s9G35fZMfaMT");
// const testAccount2 = ethAddress.fromTron("TBfAjdXMuo4rSGU8sT4rqRSFDZn1yLik8S");

const context = createContext({ network: "shasta" });

test("eth_getTransactionByHash (tx does not exist)", async (t) => {
  const res = await eth.eth_getTransactionByHash(
    ["0xdeadbeef42677e118d821d2adda714bd55b165ee7162b9bd928253d857a0b082"],
    context
  );
  // console.dir(res, { depth: null });

  t.deepEqual(res, null);
});

test("eth_getTransactionByHash", async (t) => {
  const res = await eth.eth_getTransactionByHash(
    ["0x6895f86342677e118d821d2adda714bd55b165ee7162b9bd928253d857a0b082"],
    context
  );
  // console.dir(res, { depth: null });

  t.deepEqual(res, {
    blockHash:
      "0x0000000000529b3a07a40b8af2b80b4a495a2156b1198f54c629e0b770ce8b09",
    blockNumber: "0x529b3a",
    from: "0x95c80272e929bad06f5642036eb3219983d979dc",
    gas: "0x114e",
    gasPrice: "0x4a817c800",
    hash: "0x6895f86342677e118d821d2adda714bd55b165ee7162b9bd928253d857a0b082",
    input: "0x",
    nonce: "0x15",
    r: "0x0000000000000000000000000000000000000000000000000000000000000000",
    s: "0x0000000000000000000000000000000000000000000000000000000000000000",
    to: "0x596f27c0ec9cfd403da2019926f8571450bafebd",
    v: "0x0",
    value: "0x0",
  });
});

test("eth_getTransactionByBlockNumberAndIndex", async (t) => {
  const tx = await eth.eth_getTransactionByBlockNumberAndIndex(
    [numberToHex(5417562), "0x01"],
    context
  );
  // console.dir(res, { depth: null });

  // looks like tronscan is display the txs in reverse order...
  t.deepEqual(tx, {
    blockHash:
      "0x000000000052aa5ad523476036643621809bb6decbc2b968ac5a25d6e457c0f2",
    blockNumber: "0x52aa5a",
    from: "0x95c80272e929bad06f5642036eb3219983d979dc",
    gas: "0x114e",
    gasPrice: "0x4a817c800",
    hash: "0x7c23883af82af3c5dd35d88dab8fd65866a0288465bee89ed7cabc934e0acd9c",
    input: "0x",
    nonce: "0x15",
    r: "0x0000000000000000000000000000000000000000000000000000000000000000",
    s: "0x0000000000000000000000000000000000000000000000000000000000000000",
    to: "0x596f27c0ec9cfd403da2019926f8571450bafebd",
    v: "0x0",
    value: "0x0",
  });
});

test("eth_getTransactionReceipt", async (t) => {
  const tx = await eth.eth_getTransactionReceipt(
    ["0x7c23883af82af3c5dd35d88dab8fd65866a0288465bee89ed7cabc934e0acd9c"],
    context
  );
  // console.dir(res, { depth: null });

  // looks like tronscan is display the txs in reverse order...
  const expected = {
    blockHash:
      "0x000000000052aa5ad523476036643621809bb6decbc2b968ac5a25d6e457c0f2",
    blockNumber: "0x52aa5a",
    from: "0x95c80272e929bad06f5642036eb3219983d979dc",
    to: "0x596f27c0ec9cfd403da2019926f8571450bafebd",
    hash: "0x7c23883af82af3c5dd35d88dab8fd65866a0288465bee89ed7cabc934e0acd9c",
    value: "0x0",
    gas: "0x114e",
    gasPrice: "0x4a817c800",
    input: "0x",
    nonce: "0x15",
    logsBloom:
      "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
    v: "0x0",
    r: "0x0000000000000000000000000000000000000000000000000000000000000000",
    s: "0x0000000000000000000000000000000000000000000000000000000000000000",
    transactionHash:
      "0x7c23883af82af3c5dd35d88dab8fd65866a0288465bee89ed7cabc934e0acd9c",
    transactionIndex: "0x0",
    cumulativeGasUsed: "0x114e",
    gasUsed: "0x114e",
    contractAddress: null,
    logs: [
      {
        address: "0x24ff7a32757d4621062c9c1e902c01c0efb5757a",
        topics: [
          "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
          "0x000000000000000000000000596f27c0ec9cfd403da2019926f8571450bafebd",
          "0x00000000000000000000000095c80272e929bad06f5642036eb3219983d979dc",
        ],
        data:
          "0x00000000000000000000000000000000000000000000000000000000018bef60",
        transactionIndex: "0x0",
        transactionLogIndex: "0x0",
        transactionHash:
          "0x7c23883af82af3c5dd35d88dab8fd65866a0288465bee89ed7cabc934e0acd9c",
        blockHash:
          "0x000000000052aa5ad523476036643621809bb6decbc2b968ac5a25d6e457c0f2",
        blockNumber: "0x52aa5a",
        logIndex: "0x0",
      },
      {
        address: "0x24ff7a32757d4621062c9c1e902c01c0efb5757a",
        topics: [
          "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
          "0x000000000000000000000000596f27c0ec9cfd403da2019926f8571450bafebd",
          "0x00000000000000000000000074b6ff6a481d19f6df9106fe5065ac245ce9872c",
        ],
        data:
          "0x000000000000000000000000000000000000000000000000000000000000cb20",
        transactionIndex: "0x0",
        transactionLogIndex: "0x1",
        transactionHash:
          "0x7c23883af82af3c5dd35d88dab8fd65866a0288465bee89ed7cabc934e0acd9c",
        blockHash:
          "0x000000000052aa5ad523476036643621809bb6decbc2b968ac5a25d6e457c0f2",
        blockNumber: "0x52aa5a",
        logIndex: "0x0",
      },
      {
        address: "0x596f27c0ec9cfd403da2019926f8571450bafebd",
        topics: [
          "0x7caa1b721c0f8f8b860a48ee4f5dda0b7d2f1a38b67218236e06a149b35b6284",
        ],
        data:
          "0x00000000000000000000000000000000000000000000000000000000000c0a8600000000000000000000000000000000000000000000000000000000000c0ab500000000000000000000000074b6ff6a481d19f6df9106fe5065ac245ce9872c000000000000000000000000000000000000000000000000000000000000cb20",
        transactionIndex: "0x0",
        transactionLogIndex: "0x2",
        transactionHash:
          "0x7c23883af82af3c5dd35d88dab8fd65866a0288465bee89ed7cabc934e0acd9c",
        blockHash:
          "0x000000000052aa5ad523476036643621809bb6decbc2b968ac5a25d6e457c0f2",
        blockNumber: "0x52aa5a",
        logIndex: "0x0",
      },
      {
        address: "0x596f27c0ec9cfd403da2019926f8571450bafebd",
        topics: [
          "0x0f3c4eead59c3031944ce584c81a66dff04f5077b577bda67001192d80e1d885",
        ],
        data:
          "0x00000000000000000000000000000000000000000000000000000000000c0a860000000000000000000000000000000000000000000000000000000000000001",
        transactionIndex: "0x0",
        transactionLogIndex: "0x3",
        transactionHash:
          "0x7c23883af82af3c5dd35d88dab8fd65866a0288465bee89ed7cabc934e0acd9c",
        blockHash:
          "0x000000000052aa5ad523476036643621809bb6decbc2b968ac5a25d6e457c0f2",
        blockNumber: "0x52aa5a",
        logIndex: "0x0",
      },
      {
        address: "0x596f27c0ec9cfd403da2019926f8571450bafebd",
        topics: [
          "0x7caa1b721c0f8f8b860a48ee4f5dda0b7d2f1a38b67218236e06a149b35b6284",
        ],
        data:
          "0x00000000000000000000000000000000000000000000000000000000000c0a8600000000000000000000000000000000000000000000000000000000000c0ab500000000000000000000000074b6ff6a481d19f6df9106fe5065ac245ce9872c00000000000000000000000000000000000000000000000000000000014d5ba0",
        transactionIndex: "0x0",
        transactionLogIndex: "0x4",
        transactionHash:
          "0x7c23883af82af3c5dd35d88dab8fd65866a0288465bee89ed7cabc934e0acd9c",
        blockHash:
          "0x000000000052aa5ad523476036643621809bb6decbc2b968ac5a25d6e457c0f2",
        blockNumber: "0x52aa5a",
        logIndex: "0x0",
      },
    ],
    status: "0x1",
  };
  // console.dir(tx, { depth: null });
  t.deepEqual(tx, expected);
});
