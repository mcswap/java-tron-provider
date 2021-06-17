import test from "ava";
import createJavaTronProvider, { networks } from "../src/index.js";
// import { testAccounts } from "./_common.js";
import ethers from "ethers";

test("ethers getBlockNumber", async (t) => {
  const web3Provider = createJavaTronProvider({ network: "nile" });
  const provider = new ethers.providers.Web3Provider(web3Provider);
  const blockNum = await provider.getBlockNumber();
  // nile network has 7M+ blocks
  t.true(blockNum > 7e6);
});

test("ethers getTransactionReceipt", async (t) => {
  // TRC20 approve transaction
  const approveTxHash =
    "0x2035f9f8202670e9e144b9348e425ef2a1a547a1b8c85ac7095fffa7ccc7232a";
  const web3Provider = createJavaTronProvider({ network: "nile" });
  const provider = new ethers.providers.Web3Provider(web3Provider);
  const receipt = await provider.getTransactionReceipt(approveTxHash);
  // console.dir(receipt, { depth: null });
  t.like(receipt, {
    to: "0x42C142500ff7068f326c01A8F1B3cd8ea7D9377f",
    from: "0x039E63f8d70becDaBA64A45091688A8446d57689",
    contractAddress: null,
    transactionIndex: 0,
    blockHash:
      "0x000000000084f61d20cdc4a657cea6702bd6e9e47633e1bebd49a06940194fce",
    transactionHash:
      "0x2035f9f8202670e9e144b9348e425ef2a1a547a1b8c85ac7095fffa7ccc7232a",
    logs: [
      {
        transactionIndex: 0,
        blockNumber: 8713757,
        transactionHash:
          "0x2035f9f8202670e9e144b9348e425ef2a1a547a1b8c85ac7095fffa7ccc7232a",
        address: "0x42C142500ff7068f326c01A8F1B3cd8ea7D9377f",
        topics: [
          "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925",
          "0x000000000000000000000000039e63f8d70becdaba64a45091688a8446d57689",
          "0x0000000000000000000000000d4516930df056c015e2ea7e4a959f3dcaab823f",
        ],
        data:
          "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
        logIndex: 0,
        blockHash:
          "0x000000000084f61d20cdc4a657cea6702bd6e9e47633e1bebd49a06940194fce",
      },
    ],
    blockNumber: 8713757,
    status: 1,
    byzantium: true,
  });
});

// failed tx: 7f293faa9dd5077f38caac68cffcd75ff6d755db79baeaf3ad72fd617d04b4a8

test("ethers getTransactionReceipt (failed tx)", async (t) => {
  // TRC20 approve transaction
  const failedTxHash =
    "0x7f293faa9dd5077f38caac68cffcd75ff6d755db79baeaf3ad72fd617d04b4a8";
  const web3Provider = createJavaTronProvider({ network: "nile" });
  const provider = new ethers.providers.Web3Provider(web3Provider);
  const receipt = await provider.getTransactionReceipt(failedTxHash);
  // console.dir(receipt, { depth: null });
  t.like(receipt, { status: 0 });
});

test("ethers getTransaction (failed tx)", async (t) => {
  // TRC20 approve transaction
  const failedTxHash =
    "0x7f293faa9dd5077f38caac68cffcd75ff6d755db79baeaf3ad72fd617d04b4a8";
  const web3Provider = createJavaTronProvider({ network: "nile" });
  const provider = new ethers.providers.Web3Provider(web3Provider);
  const tx = await provider.getTransaction(failedTxHash);
  // console.dir(tx, { depth: null });
  t.like(tx, {
    hash: "0x7f293faa9dd5077f38caac68cffcd75ff6d755db79baeaf3ad72fd617d04b4a8",
    blockHash:
      "0x000000000084fdfd26563bf19e2de2fd15210252cebd1b71641c5182df2b3de2",
    blockNumber: 8715773,
  });
});
