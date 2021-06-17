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
const eth_ = __importStar(require("./index.js"));
const autoRetry_js_1 = require("../autoRetry.js");
// import { numberToHex } from "../utils/index.js";
const index_js_1 = require("../../index.js");
// import config from "../../config.js";
const index_js_2 = require("../utils/index.js");
const web3_1 = __importDefault(require("web3"));
const eth = autoRetry_js_1.autoRetyAllMethods(eth_);
const web3 = new web3_1.default();
const module_1 = require("module");
const require = module_1.createRequire(import.meta.url);
// testAddress
// connector 1
const testAddress = index_js_2.address.fromTron("TAJLmoNzgYHDX5osdfa3c5s9G35fZMfaMT");
// config.set("tronNodeAddress", "http://localhost:18190");
const context = index_js_1.createContext({ network: "shasta" });
// TODO: move this test to shasta
ava_1.default.skip("eth_call - isOwnerMe()", async (t) => {
    const bountyContractInfo = require("../../../fixtures/build/contracts/Bounty.json");
    const contractAddress = index_js_2.address.fromTronHex(bountyContractInfo.networks["9"].address);
    const functionSig = web3.eth.abi.encodeFunctionSignature("isOwnerMe()");
    const encodedParams = "";
    const data = `${functionSig}${encodedParams}`;
    const res = await eth.eth_call([
        {
            from: testAddress,
            to: contractAddress,
            /*
            gas: 0,
            gasPrice: 0,
            */
            value: 0,
            data,
        },
        "latest",
    ], context);
    const result = web3.eth.abi.decodeParameter("bool", res);
    t.deepEqual(result, false);
});
ava_1.default.skip("eth_call - multiply(n1, n2)", async (t) => {
    const bountyContractInfo = require("../../../fixtures/build/contracts/Bounty.json");
    const contractAddress = index_js_2.address.fromTronHex(bountyContractInfo.networks["9"].address);
    const jsonInterface = bountyContractInfo.abi.find((abi) => abi.name === "multiply");
    const parameters = ["6", "5"];
    const data = web3.eth.abi.encodeFunctionCall(jsonInterface, parameters);
    // console.log({ data });
    const res = await eth.eth_call([
        {
            from: testAddress,
            to: contractAddress,
            /*
            gas: 0,
            gasPrice: 0,
            */
            value: 0,
            data,
        },
        "latest",
    ], context);
    const result = web3.eth.abi.decodeParameter("uint256", res);
    t.deepEqual(result, "30");
});
