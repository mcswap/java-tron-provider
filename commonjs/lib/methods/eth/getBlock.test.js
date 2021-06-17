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
const index_js_1 = require("../utils/index.js");
const index_js_2 = require("../../index.js");
const eth = autoRetry_js_1.autoRetyAllMethods(eth_);
// priv key: 52087001767e9c30288232baa07d3ac5cf0e3c8de30a49b98424ccf9b92e2dfd
const context = index_js_2.createContext({ network: "shasta" });
const expectedBlock = {
    number: "0x52570d",
    hash: "0x000000000052570d2900cc118d80dda30fb15d40f591d032b3fc23c241c138ad",
    parentHash: "0x000000000052570c22183fa9f52bf9136d09fc0f1209d4d2094324d0c9a47b71",
    timestamp: "0x54e34e8e",
    difficulty: "0x027f07",
    totalDifficulty: "0x027f07",
    miner: "0x4e65fda2159562a496f9f3522f89122a3088497a",
    nonce: "0x0000000000000000",
    receiptsRoot: "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
    sha3Uncles: "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
    uncles: [],
    logsBloom: null,
    transactionsRoot: "0x0000000000000000000000000000000000000000000000000000000000000000",
    stateRoot: "0xd5855eb08b3387c0af375e9cdb6acfc05eb8f519e419b874b6ff2ffda7ed1dff",
    extraData: "0x0000000000000000000000000000000000000000000000000000000000000000",
    size: "0x027f07",
    gasLimit: "0xbebc20",
    gasUsed: "0xf4240",
    transactions: [
        {
            blockHash: "0x000000000052570d2900cc118d80dda30fb15d40f591d032b3fc23c241c138ad",
            blockNumber: "0x52570d",
            from: "0x95c80272e929bad06f5642036eb3219983d979dc",
            to: "0x596f27c0ec9cfd403da2019926f8571450bafebd",
            hash: "0x689e181215e3e940e57041c6a0204475d930e173e8f7e5d191176f79720fa347",
            value: "0x0",
            gas: "0x0",
            gasPrice: "0x4a817c800",
            input: "0x",
            nonce: "0x15",
            v: "0x0",
            r: "0x0000000000000000000000000000000000000000000000000000000000000000",
            s: "0x0000000000000000000000000000000000000000000000000000000000000000",
            transactionIndex: "0x0",
        },
        {
            blockHash: "0x000000000052570d2900cc118d80dda30fb15d40f591d032b3fc23c241c138ad",
            blockNumber: "0x52570d",
            from: "0x95c80272e929bad06f5642036eb3219983d979dc",
            to: "0x596f27c0ec9cfd403da2019926f8571450bafebd",
            hash: "0xac61d5b7c53f468fa22e71af016e57b5a8db4db2f9959308d140f2468facb5e9",
            value: "0x0",
            gas: "0x0",
            gasPrice: "0x4a817c800",
            input: "0x",
            nonce: "0x15",
            v: "0x0",
            r: "0x0000000000000000000000000000000000000000000000000000000000000000",
            s: "0x0000000000000000000000000000000000000000000000000000000000000000",
            transactionIndex: "0x1",
        },
    ],
};
ava_1.default("eth_getBlockByHash (full transactions)", async (t) => {
    const res = await eth.eth_getBlockByHash([
        // TODO: genesis block no block number in block_header??
        "0x000000000052570d2900cc118d80dda30fb15d40f591d032b3fc23c241c138ad",
        true,
    ], context);
    // console.dir(res, { depth: null });
    t.deepEqual(res, expectedBlock);
});
ava_1.default("eth_getBlockByNumber (full transactions)", async (t) => {
    const res = await eth.eth_getBlockByNumber([
        // TODO: genesis block no block number in block_header??
        index_js_1.numberToHex(5396237),
        true,
    ], context);
    // console.dir(res, { depth: null });
    t.deepEqual(res, expectedBlock);
});
ava_1.default("eth_getBlockByNumber 2 (tx hashes)", async (t) => {
    const res = await eth.eth_getBlockByNumber([
        // TODO: genesis block no block number in block_header??
        index_js_1.numberToHex(5399339),
        false,
    ], context);
    // console.dir(res, { depth: null });
    t.deepEqual(res, {
        difficulty: "0x027f07",
        extraData: "0x0000000000000000000000000000000000000000000000000000000000000000",
        gasLimit: "0xbebc20",
        gasUsed: "0xf4240",
        hash: "0x000000000052632b414e7616cc854a0aadbae9ea5861d2d973630ba648c131d2",
        logsBloom: null,
        miner: "0x4e65fda2159562a496f9f3522f89122a3088497a",
        nonce: "0x0000000000000000",
        number: "0x52632b",
        parentHash: "0x000000000052632a3fab4a3a489459810a2af6b6f166c07f44522b5d0f4e9e36",
        receiptsRoot: "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
        sha3Uncles: "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
        size: "0x027f07",
        stateRoot: "0xd5855eb08b3387c0af375e9cdb6acfc05eb8f519e419b874b6ff2ffda7ed1dff",
        timestamp: "0x54e34e8e",
        totalDifficulty: "0x027f07",
        transactions: [],
        transactionsRoot: "0x0000000000000000000000000000000000000000000000000000000000000000",
        uncles: [],
    });
});
ava_1.default("eth_getBlock nile 4440110 does not throw (ShieldedTransferContract)", async (t) => {
    const nileContext = index_js_2.createContext({ network: "nile" });
    const res = await eth.eth_getBlockByNumber([index_js_1.numberToHex(4440110), true], nileContext);
    t.like(res, {
        hash: "0x000000000043c02e51131d7aa80e4693ec8bcd4982a3c9c499fbf1cdce8b0f56",
    });
    t.is(res.transactions.length, 1);
    t.like(res.transactions[0], {
        from: "0xae160279023ef9d5b99a19f43803e94b79b78364",
        hash: "0xcd4e00164a28e95409f2496710e2804737eee5ab1d4585fb3b8955970428e57c",
    });
});
