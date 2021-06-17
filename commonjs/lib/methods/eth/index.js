"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eth_getCode = exports.eth_getUncleCountByBlockNumber = exports.eth_getUncleCountByBlockHash = exports.eth_getBlockTransactionCountByNumber = exports.eth_getTransactionCount = exports.eth_getStorageAt = exports.eth_blockNumber = exports.eth_gasPrice = exports.eth_hashrate = exports.eth_mining = exports.eth_syncing = exports.eth_protocolVersion = exports.eth_chainId = exports.eth_getBalance = exports.eth_subscribe = exports.eth_sendTransaction = exports.eth_accounts = exports.eth_getLogs = exports.eth_call = exports.eth_getBlockByNumber = exports.eth_getBlockByHash = exports.eth_sendRawTransaction = void 0;
// import web3lib from "web3";
// import { notImplemented } from "./utils.js";
const index_js_1 = require("../utils/index.js");
const errors_js_1 = require("../../errors.js");
__exportStar(require("./getTransaction.js"), exports);
var sendRawTransaction_js_1 = require("./sendRawTransaction.js");
Object.defineProperty(exports, "eth_sendRawTransaction", { enumerable: true, get: function () { return sendRawTransaction_js_1.eth_sendRawTransaction; } });
var getBlock_js_1 = require("./getBlock.js");
Object.defineProperty(exports, "eth_getBlockByHash", { enumerable: true, get: function () { return getBlock_js_1.eth_getBlockByHash; } });
Object.defineProperty(exports, "eth_getBlockByNumber", { enumerable: true, get: function () { return getBlock_js_1.eth_getBlockByNumber; } });
var call_js_1 = require("./call.js");
Object.defineProperty(exports, "eth_call", { enumerable: true, get: function () { return call_js_1.eth_call; } });
var index_js_2 = require("./getLogs/index.js");
Object.defineProperty(exports, "eth_getLogs", { enumerable: true, get: function () { return __importDefault(index_js_2).default; } });
var accounts_js_1 = require("./accounts.js");
Object.defineProperty(exports, "eth_accounts", { enumerable: true, get: function () { return accounts_js_1.eth_accounts; } });
var sendTransaction_js_1 = require("./sendTransaction.js");
Object.defineProperty(exports, "eth_sendTransaction", { enumerable: true, get: function () { return sendTransaction_js_1.eth_sendTransaction; } });
var subscribe_js_1 = require("./subscribe.js");
Object.defineProperty(exports, "eth_subscribe", { enumerable: true, get: function () { return subscribe_js_1.eth_subscribe; } });
var getBalance_js_1 = require("./getBalance.js");
Object.defineProperty(exports, "eth_getBalance", { enumerable: true, get: function () { return getBalance_js_1.eth_getBalance; } });
var chainId_js_1 = require("./chainId.js");
Object.defineProperty(exports, "eth_chainId", { enumerable: true, get: function () { return chainId_js_1.eth_chainId; } });
var estimateGas_js_1 = require("./estimateGas.js");
Object.defineProperty(exports, "eth_estimateGas", { enumerable: true, get: function () { return estimateGas_js_1.eth_estimateGas; } })
// import qs from "querystring";
// just hardcoded to the protocol version returned by infura.io at time of writing htis
const PROTOCOL_VERSION = "0x40";
/**
 * Returns the current ethereum protocol version.
 *
 * Parameters
 * none
 *
 * Returns
 * String - The current ethereum protocol version.
 */
exports.eth_protocolVersion = async (_params, ctx) => {
    return PROTOCOL_VERSION;
};
/**
 * Returns an object with data about the sync status or false.
 * Parameters
 * none
 *
 * Returns
 * Object|Boolean, An object with sync status data or FALSE, when not syncing:
 *
 * startingBlock: QUANTITY - The block at which the import started (will only be reset, after the sync reached his head)
 * currentBlock: QUANTITY - The current block, same as eth_blockNumber
 * highestBlock: QUANTITY - The estimated highest block
 */
exports.eth_syncing = async (_params, ctx) => {
    // TODO
    return false;
};
// The address owned by the client that is used as default for things like the mining reward
/*
export const eth_coinbase = async (_params, _ctx) => {
  // infura returns this error as well so should be fine
};
*/
/**
 * Returns true if client is actively mining new blocks.
 *
 * Parameters
 * none
 *
 * Returns
 * Boolean - returns true of the client is mining, otherwise false.
 */
exports.eth_mining = () => {
    // not important
    return false;
};
/**
 * eth_hashrate
 * Returns the number of hashes per second that the node is mining with.
 *
 * Parameters
 * none
 *
 * Returns
 * QUANTITY - number of hashes per second.
 */
exports.eth_hashrate = () => {
    // not important
    return index_js_1.formatQuantity(0);
};
/**
 * eth_gasPrice
 * Returns the current price per gas in wei.
 *
 * Parameters
 * none
 *
 * Returns
 * QUANTITY - integer of the current gas price in wei.
 *
 */
exports.eth_gasPrice = async (_, ctx) => {
    // not relevant for Tron...
    // Let's return price in sun for 1 energy/bandwidth
    const { data } = await ctx.tronClient.get("/wallet/getchainparameters");
    const p = data.chainParameter.find((param) => param.key === "getEnergyFee");
    if (!p) {
        throw new errors_js_1.ServerError("could not find getEnergyFee chainparameter");
    }
    const fee = p.value;
    // 1 SUN = 0.000001
    // TODO: convert SUN to WEI?
    return index_js_1.formatQuantity(fee); // in SUN
};
/**
 * eth_blockNumber
 * Returns the number of most recent block.
 *
 * Parameters
 * none
 *
 * Returns
 * QUANTITY - integer of the current block number the client is on.
 */
exports.eth_blockNumber = async (_, ctx) => {
    // not relevant for Tron...
    // Let's return price in sun for 1 energy/bandwidth
    const { data } = await ctx.tronClient.get("/wallet/getnowblock");
    const blockNum = data.block_header.raw_data.number;
    return index_js_1.formatQuantity(blockNum);
};
/**
 * eth_getStorageAt
 * Returns the value from a storage position at a given address.
 *
 * Parameters
 * DATA, 20 Bytes - address of the storage.
 * QUANTITY - integer of the position in the storage.
 * QUANTITY|TAG - integer block number, or the string "latest", "earliest" or "pending", see the default block parameter
 * Returns
 * DATA - the value at this storage position.
 */
/*
export const eth_getStorageAt = async (
  [_contractAddress, _position, _blockNum],
  ctx
) => {
  // TODO: Tron does not have this API, we would have to add it directly to Java-Tron's API
};
*/
exports.eth_getStorageAt = async (_args, _ctx) => {
    // TODO: return actual contract storage... unfortunately not supported by java-tron api at moment
    return `0x0000000000000000000000000000000000000000000000000000000000000000`;
};
/**
 * eth_getTransactionCount
 * Returns the number of transactions sent from an address.
 *
 * Parameters
 * DATA, 20 Bytes - address.
 * QUANTITY|TAG - integer block number, or the string "latest", "earliest" or "pending", see the default block parameter
 *
 * Example Parameters
 * params: [
 *    '0xc94770007dda54cF92009BFF0dE90c06F603a09f',
 *    'latest' // state at the latest block
 * ]
 * Returns
 * QUANTITY - integer of the number of transactions send from this address.
 */
/*
export const eth_getTransactionCount = async ([account, blockNum], ctx) => {
  if (blockNum !== "latest") {
    // TODO: I don't believe tron api support querying balance amount using a block number parameter
    warn('eth_getTransactionCount: second argument defaulted to "latest"');
  }

  const address = ethAddress.toTron(account);
  const query = { only_from: true, limit: 200 };
  const { data } = await ctx.tronClient.get(
    `/v1/accounts/${address}/transactions?${qs.stringify(query)}`
  );
  // TODO: tron doesn't have equivalent API but we can get a list of transactions..
  // TODO: this will be incorrect past 200 transactions.. paginate?
  const count = data.data.length;
  if (count >= 200) {
    warn(
      "eth_getTransactionCount: the number of transaction does will stay at 200 after 200"
    );
  }
  return formatQuantity(count);
};
*/
exports.eth_getTransactionCount = async ([account, blockNum], ctx) => {
    index_js_1.warn("eth_getTransactionCount: not implemented... always returns 0");
    // TODO: tron does not have an equivalent API call :(
    return index_js_1.formatQuantity(0);
};
/**
 * eth_getBlockTransactionCountByNumber
 * Returns the number of transactions in a block matching the given block number.
 *
 * Parameters
 * QUANTITY|TAG - integer of a block number, or the string "earliest", "latest" or "pending", as in the default block parameter.
 * Example Parameters
 * params: [
 *    '0xe8', // 232
 * ]
 * Returns
 * QUANTITY - integer of the number of transactions in this block.
 */
exports.eth_getBlockTransactionCountByNumber = async ([blockNum], ctx) => {
    let num;
    if (blockNum === "latest") {
        const { data } = await ctx.tronClient.get("/wallet/getnowblock");
        num = data.block_header.raw_data.number;
    }
    else {
        num = index_js_1.hexToNumber(blockNum);
    }
    const { data } = await ctx.tronClient.post(`/wallet/gettransactioninfobyblocknum`, {
        num,
    });
    const txNum = data.length;
    return index_js_1.formatQuantity(txNum);
};
/**
 * eth_getUncleCountByBlockHash
 * Returns the number of uncles in a block from a block matching the given block hash.
 *
 * Parameters
 * DATA, 32 Bytes - hash of a block.
 * Example Parameters
 * params: [
 *    '0xc94770007dda54cF92009BFF0dE90c06F603a09f'
 * ]
 * Returns
 * QUANTITY - integer of the number of uncles in this block.
 */
exports.eth_getUncleCountByBlockHash = async ([blockHash], ctx) => {
    index_js_1.warn("eth_getUncleCountByBlockHash: Tron does not seem to have a concept of 'uncles'");
    return index_js_1.formatQuantity(0);
};
exports.eth_getUncleCountByBlockNumber = async () => {
    index_js_1.warn("eth_getUncleCountByBlockNumber: Tron does not seem to have a concept of 'uncles'");
    return index_js_1.formatQuantity(0);
};
/**
 * eth_getCode
 * Returns code at a given address.
 *
 * Parameters
 * DATA, 20 Bytes - address.
 * QUANTITY|TAG - integer block number, or the string "latest", "earliest" or "pending", see the default block parameter.
 * Example Parameters
 * params: [
 *    '0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b',
 *    '0x2'  // 2
 * ]
 * Returns
 * DATA - the code from the given address.
 */
exports.eth_getCode = async ([account, blockNum], ctx) => {
    if (blockNum !== "latest") {
        index_js_1.warn('eth_getCode: second argument defaulted to "latest"');
    }
    const address = index_js_1.address.toTron(account);
    const { data, ...rest } = await ctx.tronClient.post(`/wallet/getcontract`, {
        value: address,
        visible: true,
    });
    // java-tron returns { Error: 'class java.lang.NullPointerException :
    // null' } if contract does not exist
    if (data.Error) {
        // Ethereum RPC returns "0x" for non-existing contract
        return "0x";
    }
    return `0x${data.bytecode}`;
};
/**
 * eth_sign
 * The sign method calculates an Ethereum specific signature with:
 * sign(keccak256("\x19Ethereum Signed Message:\n" + len(message) + message))).
 *
 * By adding a prefix to the message makes the calculated signature
 * recognisable as an Ethereum specific signature. This prevents misuse where a
 * malicious DApp can sign arbitrary data (e.g. transaction) and use the
 * signature to impersonate the victim.
 *
 * Note the address to sign with must be unlocked.
 *
 * Parameters
 * account, message
 *
 * DATA, 20 Bytes - address.
 * DATA, N Bytes - message to sign.
 *
 * Returns
 * DATA: Signature
 */
/*
export const eth_sign = async ([_account, _message], ctx) => {
  // infura.io also does not support so should not be too important
};
*/
/*
 * eth_estimateGas
 * Generates and returns an estimate of how much gas is necessary to allow the transaction to complete. The transaction will not be added to the blockchain. Note that the estimate may be significantly more than the amount of gas actually used by the transaction, for a variety of reasons including EVM mechanics and node performance.
 *
 * Parameters
 * See eth_call parameters, expect that all properties are optional. If no gas limit is specified geth uses the block gas limit from the pending block as an upper bound. As a result the returned estimate might not be enough to executed the call/transaction when the amount of gas is higher than the pending block gas limit.
 *
 * Returns
 * QUANTITY - the amount of gas used.
 */
/*
export const eth_estimateGas = async (_params, _ctx) => {
  // Tron has no equivalent API call
  // https://github.com/tronprotocol/java-tron/issues/2982
};

export const eth_getUncleByBlockHashAndIndex = async (_params, _ctx) => {
  // Tron has no equivalent API call :(
};
export const eth_getUncleByBlockNumberAndIndex = async (_params, _ctx) => {
  // Tron has no equivalent API call :(
};
export const eth_newFilter = async (_params, _ctx) => {
  // Tron has no equivalent API call :(
};
export const eth_newBlockFilter = async (_params, _ctx) => {
  // Tron has no equivalent API call :(
};
export const eth_newPendingTransactionFilter = async (_params, _ctx) => {
  // Tron has no equivalent API call :(
};
export const eth_uninstallFilter = async (_params, _ctx) => {
  // Tron has no equivalent API call :(
};
export const eth_getFilterChanges = async (_params, _ctx) => {
  // Tron has no equivalent API call :(
};
export const eth_getFilterLogs = async (_params, _ctx) => {
  // Tron has no equivalent API call :(
};
// TODO: might be possible to simulate this...
export const eth_getWork = async (_params, _ctx) => {
  // Tron has no equivalent API call :(
};

export const eth_submitWork = async (_params, _ctx) => {
  // Tron has no equivalent API call :(
};

export const eth_submitHashrate = async (_params, _ctx) => {
  // Tron has no equivalent API call :(
};

export const eth_getProof = async (_params, _ctx) => {
  // Tron has no equivalent API call :(
};
*/
