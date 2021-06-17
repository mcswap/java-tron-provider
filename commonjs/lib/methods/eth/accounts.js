"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eth_accounts = void 0;
const web3_1 = __importDefault(require("web3"));
const web3 = new web3_1.default();
// const { ethErrors } = ethRpcErrors;
/**
 * eth_accounts
 * Returns a list of addresses owned by client.
 *
 * Parameters
 * none
 *
 * Returns
 * Array of DATA, 20 Bytes - addresses owned by the client.
 */
exports.eth_accounts = async (_params, ctx) => {
    if (ctx.privateKey) {
        const { privateKey } = ctx;
        const account = web3.eth.accounts.privateKeyToAccount(privateKey);
        const address = account.address;
        return [address];
    }
    return [];
};
