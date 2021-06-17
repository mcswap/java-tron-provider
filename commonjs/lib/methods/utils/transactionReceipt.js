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
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromTron = void 0;
const index_js_1 = require("./index.js");
const transaction = __importStar(require("./transaction.js"));
const ethAddress = __importStar(require("./address.js"));
// prefix with 0x
const fromTronHex = (tronHexStr = "") => {
    return `0x${tronHexStr}`;
};
// https://github.com/tomusdrw/rust-web3/blob/master/src/types/log.rs#L7
const fromTronLog = (tronLog, { transactionLogIndex, transactionIndex, blockHash, transactionHash, blockNumber, logIndex, }) => {
    return {
        address: fromTronHex(tronLog.address),
        topics: tronLog.topics.map(fromTronHex),
        data: fromTronHex(tronLog.data),
        transactionIndex: index_js_1.numberToHex(transactionIndex),
        // index in block
        logIndex: index_js_1.numberToHex(logIndex || 0),
        // index in transaction
        transactionLogIndex: index_js_1.numberToHex(transactionLogIndex),
        transactionHash,
        blockHash,
        ...(Number.isInteger(blockNumber)
            ? { blockNumber: index_js_1.numberToHex(blockNumber) }
            : {}),
    };
};
/*
Ethereum Tx receipt structure:

`Object` - A transaction receipt object, or `null` when no receipt was found:

  - `transactionHash `: `DATA`, 32 Bytes - hash of the transaction.
  - `transactionIndex`: `QUANTITY` - integer of the transaction's index position in the block.
  - `blockHash`: `DATA`, 32 Bytes - hash of the block where this transaction was in.
  - `blockNumber`: `QUANTITY` - block number where this transaction was in.
  - `from`: `DATA`, 20 Bytes - address of the sender.
  - `to`: `DATA`, 20 Bytes - address of the receiver. null when it's a contract creation transaction.
  - `cumulativeGasUsed `: `QUANTITY ` - The total amount of gas used when this transaction was executed in the block.
  - `gasUsed `: `QUANTITY ` - The amount of gas used by this specific transaction alone.
  - `contractAddress `: `DATA`, 20 Bytes - The contract address created, if the transaction was a contract creation, otherwise `null`.
  - `logs`: `Array` - Array of log objects, which this transaction generated.
  - `logsBloom`: `DATA`, 256 Bytes - Bloom filter for light clients to quickly retrieve related logs.

It also returns _either_ :

  - `root` : `DATA` 32 bytes of post-transaction stateroot (pre Byzantium)
  - `status`: `QUANTITY` either `1` (success) or `0` (failure)
*/
const emptyLogsBloom = "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000";
// TODO: not sure which one is more accurate...
function determineSuccess(tronTx, tronTxInfo) {
    try {
        try {
            return tronTx.ret[0].contractRet === "SUCCESS";
        }
        catch (err) {
            return tronTxInfo.receipt.result === "SUCCESS";
        }
    }
    catch (err) {
        return false;
    }
}
exports.fromTron = (tronTx, tronTxInfo, blockHash, transactionIndex) => {
    const tx = transaction.fromTron(tronTx, tronTxInfo, blockHash);
    let contractAddress = null;
    const contract = tronTx.raw_data.contract[0];
    const type = contract.type;
    if (type === "CreateSmartContract") {
        contractAddress = ethAddress.fromTronHex(tronTx.contract_address);
    }
    const isSuccess = determineSuccess(tronTx, tronTxInfo);
    const gasUsed = tx.gas || index_js_1.numberToHex(1337);
    const transactionHash = tx.hash;
    const res = {
        ...tx,
        transactionHash,
        transactionIndex: index_js_1.numberToHex(transactionIndex),
        // dummy data... not sure of Tron equivalent
        cumulativeGasUsed: gasUsed,
        gasUsed: gasUsed,
        contractAddress,
        // TODO: convert logs to ethereum format
        // logs: tronTxInfo.log || [],
        logs: (tronTxInfo.log || []).map((tronLog, transactionLogIndex) => fromTronLog(tronLog, {
            transactionLogIndex,
            blockHash,
            transactionIndex,
            transactionHash,
            blockNumber: tronTxInfo.blockNumber,
        })),
        // TODO: no logsBloom equivalent?
        logsBloom: emptyLogsBloom,
        status: index_js_1.numberToHex(isSuccess ? 1 : 0),
    };
    // console.dir(res, { depth: null });
    return res;
};
