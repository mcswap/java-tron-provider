import test from "ava";
import Web3 from "web3";
import * as eth_ from "./index.js";
import { autoRetyAllMethods } from "../autoRetry.js";
import * as errors from "../../errors.js";
import {
  address as ethAddress,
  hexToNumber,
  numberToHex,
  toBN,
} from "../utils/index.js";
import { createContext } from "../../index.js";

const eth = autoRetyAllMethods(eth_);
// priv key: 52087001767e9c30288232baa07d3ac5cf0e3c8de30a49b98424ccf9b92e2dfd
const testAccount = ethAddress.fromTron("TRa2Cy4coaCQeX5rKdQdZbviHGFhqpqkuA");
const testAccount2 = ethAddress.fromTron("TBfAjdXMuo4rSGU8sT4rqRSFDZn1yLik8S");

const context = createContext({ network: "shasta" });

test("eth_protocolVersion", async (t) => {
  const res = await eth.eth_protocolVersion([], context);
  t.is(res, "0x40");
});

test("eth_syncing", async (t) => {
  const res = await eth.eth_syncing([], context);
  t.is(res, false);
});

test("eth_coinbase", async (t) => {
  await t.throwsAsync(
    async () => {
      await eth.eth_coinbase([], context);
    },
    { message: "eth.eth_coinbase is not a function" }
  );
});

test("eth_mining", async (t) => {
  const res = await eth.eth_mining([], context);
  t.is(res, false);
});

test("eth_hashrate", async (t) => {
  const res = await eth.eth_hashrate([], context);
  t.is(res, "0x0");
});

test("eth_gasPrice", async (t) => {
  const res = await eth.eth_gasPrice([], context);
  t.is(hexToNumber(res), 140);
});

test("eth_accounts", async (t) => {
  const res = await eth.eth_accounts([], context);
  t.deepEqual(res, []);
});

test("eth_blockNumber", async (t) => {
  const res = await eth.eth_blockNumber([], context);
  t.true(hexToNumber(res) > 1, "block number > 1");
});

test("eth_getBalance (latest block)", async (t) => {
  const res = await eth.eth_getBalance([testAccount, "latest"], context);
  if (context.config.convertToWei) {
    t.is(toBN(res).toString(), "20000000000000000000000");
  } else {
    t.is(toBN(res).toString(), "20000000000");
  }
});

test("eth_getBalance (account does not exist)", async (t) => {
  const addr = `${testAccount.substr(-1)}f`;
  const res = await eth.eth_getBalance([addr, "latest"], context);
  t.is(res, "0x0");
});

test("eth_getTransactionCount (latest block)", async (t) => {
  const res = await eth.eth_getTransactionCount(
    [testAccount2, "latest"],
    context
  );
  t.true(hexToNumber(res) >= 0);
});

test("eth_getBlockTransactionCountByNumber (block #5392999)", async (t) => {
  const res = await eth.eth_getBlockTransactionCountByNumber(
    ["0x524A67"],
    context
  );
  t.is(hexToNumber(res), 3);
});

test("eth_getBlockTransactionCountByNumber (latest block)", async (t) => {
  const res = await eth.eth_getBlockTransactionCountByNumber(
    ["latest"],
    context
  );
  t.true(hexToNumber(res) >= 0);
});

// https://shasta.tronscan.org/#/contract/TUHwKtFJekVJr9nYpr4sichtJ6oXt1NCkN/code
test("eth_getCode", async (t) => {
  const res = await eth.eth_getCode(
    [ethAddress.fromTron("TUHwKtFJekVJr9nYpr4sichtJ6oXt1NCkN"), "latest"],
    context
  );
  t.is(
    res,
    "0x610159610030600b82828239805160001a6073146000811461002057610022565bfe5b5030600052607381538281f300730000000000000000000000000000000000000000301460806040526004361061008e5763ffffffff7c0100000000000000000000000000000000000000000000000000000000600035041663313ce5678114610093578063864029e7146100b1578063907af6c0146100cb5780639d8e2177146100d3578063d5e5e6e6146100db578063def4419d146100e3575b600080fd5b61009b6100eb565b6040805160ff9092168252519081900360200190f35b6100b96100f0565b60408051918252519081900360200190f35b6100b9610100565b6100b961010c565b6100b9610118565b61009b610128565b601281565b6b033b2e3c9fd0803ce800000081565b670de0b6b3a764000090565b670de0b6b3a764000081565b6b033b2e3c9fd0803ce800000090565b601b815600a165627a7a72305820debc1c891210319e5c53162d29ba16e02229ffdfcfc980d1196b1ab341d10a070029"
  );
});

// https://shasta.tronscan.org/#/contract/TUHwKtFJekVJr9nYpr4sichtJ6oXt1NCkN/code
test.skip("eth_call", async (t) => {
  const web3 = new Web3();
  const methodSelector = web3.eth.abi.encodeFunctionSignature("decimals()");

  const res = await eth.eth_call(
    [
      {
        from: testAccount,
        to: ethAddress.fromTron("TUHwKtFJekVJr9nYpr4sichtJ6oXt1NCkN"),
        data: `${methodSelector}`,
      },
      "latest",
    ],
    context
  );
  t.deepEqual(res, {});
});
