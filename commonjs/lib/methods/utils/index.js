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
exports.maybeThrowJavaTronError = exports.sunToWei = exports.formatQuantity = exports.toBN = exports.numberToHex = exports.keccak256 = exports.hexToNumber = exports.address = exports.block = exports.transactionReceipt = exports.transaction = exports.warn = void 0;
// import { ServerError } from "../../errors.js";
const web3_1 = __importDefault(require("web3"));
const transaction = __importStar(require("./transaction.js"));
exports.transaction = transaction;
const transactionReceipt = __importStar(require("./transactionReceipt.js"));
exports.transactionReceipt = transactionReceipt;
const block = __importStar(require("./block.js"));
exports.block = block;
const address = __importStar(require("./address.js"));
exports.address = address;
const debug_1 = __importDefault(require("debug"));
const eth_rpc_errors_1 = __importDefault(require("eth-rpc-errors"));
exports.warn = debug_1.default("java-tron-provider:warn");
const { utils: { hexToNumber, numberToHex, keccak256, toBN }, } = web3_1.default;
exports.hexToNumber = hexToNumber;
exports.numberToHex = numberToHex;
exports.keccak256 = keccak256;
exports.toBN = toBN;
// https://github.com/ethereum/wiki/wiki/JSON-RPC#hex-value-encoding
exports.formatQuantity = (n) => {
    return web3_1.default.utils.numberToHex(n);
};
exports.sunToWei = (n) => {
    // eth decimals: 18
    // trx decimals: 6
    // delta: 18 - 6 = 12
    return toBN(n).mul(toBN(10).pow(toBN(12)));
};
function maybeThrowJavaTronError(data) {
    const { ethErrors } = eth_rpc_errors_1.default;
    // sometimes error look like `{ code ,txid, message }` and sometimes
    // like `{ result: { code, txid, message } }` ....
    const result = data.result || data;
    if (typeof result === "object" && result && result.code && result.message) {
        // TODO: map java-tron error codes to correct rpc errors...
        // TODO: handle this res:
        /*
           {"result":{"code":"CONTRACT_VALIDATE_ERROR","message":"No contract or not a smart contract"}}
         */
        throw ethErrors.rpc.resourceNotFound({
            message: `${result.code}: ${result.message}`,
            data: result,
        });
    }
}
exports.maybeThrowJavaTronError = maybeThrowJavaTronError;
