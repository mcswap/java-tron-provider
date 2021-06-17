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
/*
Example block (from rust-web3 src/api/eth.rs)
{
    "number": "0x1b4",
    "hash": "0x0e670ec64341771606e55d6b4ca35a1a6b75ee3d5145a99d05921026d1527331",
    "parentHash": "0x9646252be9520f6e71339a8df9c55e4d7619deeb018d2a3f2d21fc165dde5eb5",
    "mixHash": "0x1010101010101010101010101010101010101010101010101010101010101010",
    "nonce": "0x0000000000000000",
    "sealFields": [
      "0xe04d296d2460cfb8472af2c5fd05b5a214109c25688d3704aed5484f9a7792f2",
      "0x0000000000000042"
    ],
    "sha3Uncles": "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
    "logsBloom":  "0x0e670ec64341771606e55d6b4ca35a1a6b75ee3d5145a99d05921026d15273310e670ec64341771606e55d6b4ca35a1a6b75ee3d5145a99d05921026d15273310e670ec64341771606e55d6b4ca35a1a6b75ee3d5145a99d05921026d15273310e670ec64341771606e55d6b4ca35a1a6b75ee3d5145a99d05921026d15273310e670ec64341771606e55d6b4ca35a1a6b75ee3d5145a99d05921026d15273310e670ec64341771606e55d6b4ca35a1a6b75ee3d5145a99d05921026d15273310e670ec64341771606e55d6b4ca35a1a6b75ee3d5145a99d05921026d15273310e670ec64341771606e55d6b4ca35a1a6b75ee3d5145a99d05921026d1527331",
    "transactionsRoot": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
    "receiptsRoot": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
    "stateRoot": "0xd5855eb08b3387c0af375e9cdb6acfc05eb8f519e419b874b6ff2ffda7ed1dff",
    "miner": "0x4e65fda2159562a496f9f3522f89122a3088497a",
    "difficulty": "0x27f07",
    "totalDifficulty": "0x27f07",
    "extraData": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "size": "0x27f07",
    "gasLimit": "0x9f759",
    "minGasPrice": "0x9f759",
    "gasUsed": "0x9f759",
    "timestamp": "0x54e34e8e",
    "transactions": [],
    "uncles": []
}
*/
// from tronblock to eth block
// https://github.com/tomusdrw/rust-web3/blob/master/src/types/block.rs#L55
exports.fromTron = (tronBlock) => {
    // For stuff that does not have an equivalent in Tron API (or at least, that I don't know of)
    // console.dir({ tronBlock }, { depth: null });
    const dummyData = {
        // Tron does not have a difficulty or nonce since it is proof of stake based...
        // We will just return hardcoded dummy values to not break clients that use
        // them in a non critical way
        difficulty: "0x027f07",
        totalDifficulty: "0x027f07",
        nonce: "0x0000000000000000",
        // nonce: "0xe04d296d2460cfb8472af2c5fd05b5a214109c25688d3704aed5484f9a7792f2
        // Tron does not use uncles... dummy hardcoded value
        sha3Uncles: "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
        uncles: [],
        // I don't believe Tron has a logsBloom,
        logsBloom: null,
        // No good equivalents in Tron?
        transactionsRoot: "0x0000000000000000000000000000000000000000000000000000000000000000",
        // stateRoot: "0x0000000000000000000000000000000000000000000000000000000000000000",
        receiptsRoot: "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
        stateRoot: "0xd5855eb08b3387c0af375e9cdb6acfc05eb8f519e419b874b6ff2ffda7ed1dff",
        miner: "0x4e65fda2159562a496f9f3522f89122a3088497a",
        extraData: "0x0000000000000000000000000000000000000000000000000000000000000000",
        size: "0x027f07",
        gasLimit: index_js_1.numberToHex(12500000),
        gasUsed: index_js_1.numberToHex(1e6),
    };
    // important: tronBlock.block_header.raw_data.number is not set on block 0 lol!
    const blockNumber = tronBlock.block_header.raw_data.number || 0;
    let b = {
        number: index_js_1.numberToHex(blockNumber),
        hash: `0x${tronBlock.blockID}`,
        parentHash: `0x${tronBlock.block_header.raw_data.parentHash}`,
        timestamp: index_js_1.numberToHex(1424182926),
        ...dummyData,
    };
    b = {
        ...b,
        transactions: tronBlock.transactions.map((tx, idx) => {
            return {
                // TODO: get txInfo using /wallet/gettransactioninfobyblocknum instead of mocking here
                ...transaction.fromTron(tx, { fee: 0, blockNumber }, b.hash),
                transactionIndex: index_js_1.numberToHex(idx),
            };
        }),
    };
    return b;
};
