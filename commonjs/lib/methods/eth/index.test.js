"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = __importDefault(require("ava"));
const web3_1 = __importDefault(require("web3"));
const eth_ = __importStar(require("./index.js"));
const autoRetry_js_1 = require("../autoRetry.js");
const index_js_1 = require("../utils/index.js");
const index_js_2 = require("../../index.js");
const eth = autoRetry_js_1.autoRetyAllMethods(eth_);
// priv key: 52087001767e9c30288232baa07d3ac5cf0e3c8de30a49b98424ccf9b92e2dfd
const testAccount = index_js_1.address.fromTron("TRa2Cy4coaCQeX5rKdQdZbviHGFhqpqkuA");
const testAccount2 = index_js_1.address.fromTron("TBfAjdXMuo4rSGU8sT4rqRSFDZn1yLik8S");
const context = index_js_2.createContext({ network: "shasta" });
ava_1.default("eth_protocolVersion", async (t) => {
    const res = await eth.eth_protocolVersion([], context);
    t.is(res, "0x40");
});
ava_1.default("eth_syncing", async (t) => {
    const res = await eth.eth_syncing([], context);
    t.is(res, false);
});
ava_1.default("eth_coinbase", async (t) => {
    await t.throwsAsync(async () => {
        await eth.eth_coinbase([], context);
    }, { message: "eth.eth_coinbase is not a function" });
});
ava_1.default("eth_mining", async (t) => {
    const res = await eth.eth_mining([], context);
    t.is(res, false);
});
ava_1.default("eth_hashrate", async (t) => {
    const res = await eth.eth_hashrate([], context);
    t.is(res, "0x0");
});
ava_1.default("eth_gasPrice", async (t) => {
    const res = await eth.eth_gasPrice([], context);
    t.is(index_js_1.hexToNumber(res), 10);
});
ava_1.default("eth_accounts", async (t) => {
    const res = await eth.eth_accounts([], context);
    t.deepEqual(res, []);
});
ava_1.default("eth_blockNumber", async (t) => {
    const res = await eth.eth_blockNumber([], context);
    t.true(index_js_1.hexToNumber(res) > 1, "block number > 1");
});
ava_1.default("eth_getBalance (latest block)", async (t) => {
    const res = await eth.eth_getBalance([testAccount, "latest"], context);
    if (context.config.convertToWei) {
        t.is(index_js_1.toBN(res).toString(), "20000000000000000000000");
    }
    else {
        t.is(index_js_1.toBN(res).toString(), "20000000000");
    }
});
ava_1.default("eth_getBalance (account does not exist)", async (t) => {
    const addr = `${testAccount.substr(-1)}f`;
    const res = await eth.eth_getBalance([addr, "latest"], context);
    t.is(res, "0x0");
});
ava_1.default("eth_getTransactionCount (latest block)", async (t) => {
    const res = await eth.eth_getTransactionCount([testAccount2, "latest"], context);
    t.true(index_js_1.hexToNumber(res) >= 0);
});
ava_1.default("eth_getBlockTransactionCountByNumber (block #5392999)", async (t) => {
    const res = await eth.eth_getBlockTransactionCountByNumber(["0x524A67"], context);
    t.is(index_js_1.hexToNumber(res), 3);
});
ava_1.default("eth_getBlockTransactionCountByNumber (latest block)", async (t) => {
    const res = await eth.eth_getBlockTransactionCountByNumber(["latest"], context);
    t.true(index_js_1.hexToNumber(res) >= 0);
});
// https://shasta.tronscan.org/#/contract/TUHwKtFJekVJr9nYpr4sichtJ6oXt1NCkN/code
ava_1.default("eth_getCode", async (t) => {
    const res = await eth.eth_getCode([index_js_1.address.fromTron("TUHwKtFJekVJr9nYpr4sichtJ6oXt1NCkN"), "latest"], context);
    t.is(res, "0x610159610030600b82828239805160001a6073146000811461002057610022565bfe5b5030600052607381538281f300730000000000000000000000000000000000000000301460806040526004361061008e5763ffffffff7c0100000000000000000000000000000000000000000000000000000000600035041663313ce5678114610093578063864029e7146100b1578063907af6c0146100cb5780639d8e2177146100d3578063d5e5e6e6146100db578063def4419d146100e3575b600080fd5b61009b6100eb565b6040805160ff9092168252519081900360200190f35b6100b96100f0565b60408051918252519081900360200190f35b6100b9610100565b6100b961010c565b6100b9610118565b61009b610128565b601281565b6b033b2e3c9fd0803ce800000081565b670de0b6b3a764000090565b670de0b6b3a764000081565b6b033b2e3c9fd0803ce800000090565b601b815600a165627a7a72305820debc1c891210319e5c53162d29ba16e02229ffdfcfc980d1196b1ab341d10a070029");
});
// https://shasta.tronscan.org/#/contract/TUHwKtFJekVJr9nYpr4sichtJ6oXt1NCkN/code
ava_1.default.skip("eth_call", async (t) => {
    const web3 = new web3_1.default();
    const methodSelector = web3.eth.abi.encodeFunctionSignature("decimals()");
    const res = await eth.eth_call([
        {
            from: testAccount,
            to: index_js_1.address.fromTron("TUHwKtFJekVJr9nYpr4sichtJ6oXt1NCkN"),
            data: `${methodSelector}`,
        },
        "latest",
    ], context);
    t.deepEqual(res, {});
});
