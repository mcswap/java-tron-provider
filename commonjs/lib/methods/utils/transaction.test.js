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
const transaction = __importStar(require("./transaction.js"));
const tx = {
    ret: [
        {
            contractRet: "SUCCESS",
        },
    ],
    signature: [
        "df05ccf37aeef4709636a03e2675d4150abf57f3e71cd1ce0b09775b2ff0ae772a8b7f6164fb2966720c6c16b21e42a53c3dddc272c014f96734c43a00d7bfbd00",
    ],
    txID: "6895f86342677e118d821d2adda714bd55b165ee7162b9bd928253d857a0b082",
    raw_data: {
        contract: [
            {
                parameter: {
                    value: {
                        data: "b05c39cd00000000000000000000000000000000000000000000000000000000000bfdf500000000000000000000000000000000000000000000000000000000000bfcbd0000000000000000000000000000000000000000000000000000000000b71b0000000000000000000000000000000000000000000000000000000000015d128c00000000000000000000000000000000000000000000000000000000001d16e1",
                        owner_address: "4195c80272e929bad06f5642036eb3219983d979dc",
                        contract_address: "41596f27c0ec9cfd403da2019926f8571450bafebd",
                        call_value: null,
                        amount: null,
                        asset_name: null,
                        to_address: null,
                    },
                    type_url: "type.googleapis.com/protocol.TriggerSmartContract",
                },
                type: "TriggerSmartContract",
            },
        ],
        ref_block_bytes: "9b39",
        ref_block_hash: "c7923e44e83c25fa",
        expiration: 1592233456141,
        timestamp: 1592233276141,
    },
    raw_data_hex: "0a029b392208c7923e44e83c25fa408de489c4ab2e5a9002081f128b020a31747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e54726967676572536d617274436f6e747261637412d5010a154195c80272e929bad06f5642036eb3219983d979dc121541596f27c0ec9cfd403da2019926f8571450bafebd22a401b05c39cd00000000000000000000000000000000000000000000000000000000000bfdf500000000000000000000000000000000000000000000000000000000000bfcbd0000000000000000000000000000000000000000000000000000000000b71b0000000000000000000000000000000000000000000000000000000000015d128c00000000000000000000000000000000000000000000000000000000001d16e170ede5fec3ab2e900180dac409",
};
const txInfo = {
    id: "6895f86342677e118d821d2adda714bd55b165ee7162b9bd928253d857a0b082",
    fee: 4430,
    blockNumber: 5413690,
    blockTimeStamp: 1592233278000,
    contractResult: [""],
    receipt: {
        net_fee: 4430,
        energy_usage: 123274,
        energy_usage_total: 123274,
        net_usage: null,
        result: "SUCCESS",
    },
    contract_address: "41596f27c0ec9cfd403da2019926f8571450bafebd",
    log: [
        {
            address: "309c64dab7d82443cded1ac9c2eb38269c35f6ee",
            topics: [
                "ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
                "000000000000000000000000596f27c0ec9cfd403da2019926f8571450bafebd",
                "00000000000000000000000095c80272e929bad06f5642036eb3219983d979dc",
            ],
            data: "0000000000000000000000000000000000000000000000000000000000b6bd40",
        },
        {
            address: "309c64dab7d82443cded1ac9c2eb38269c35f6ee",
            topics: [
                "ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
                "000000000000000000000000596f27c0ec9cfd403da2019926f8571450bafebd",
                "00000000000000000000000074b6ff6a481d19f6df9106fe5065ac245ce9872c",
            ],
            data: "0000000000000000000000000000000000000000000000000000000000005dc0",
        },
        {
            address: "596f27c0ec9cfd403da2019926f8571450bafebd",
            topics: [
                "7caa1b721c0f8f8b860a48ee4f5dda0b7d2f1a38b67218236e06a149b35b6284",
            ],
            data: "00000000000000000000000000000000000000000000000000000000000bfdf500000000000000000000000000000000000000000000000000000000000bfcbd00000000000000000000000074b6ff6a481d19f6df9106fe5065ac245ce9872c0000000000000000000000000000000000000000000000000000000000005dc0",
        },
        {
            address: "596f27c0ec9cfd403da2019926f8571450bafebd",
            topics: [
                "7caa1b721c0f8f8b860a48ee4f5dda0b7d2f1a38b67218236e06a149b35b6284",
            ],
            data: "00000000000000000000000000000000000000000000000000000000000bfdf500000000000000000000000000000000000000000000000000000000000bfcbd00000000000000000000000074b6ff6a481d19f6df9106fe5065ac245ce9872c00000000000000000000000000000000000000000000000000000000015c5fd2",
        },
        {
            address: "596f27c0ec9cfd403da2019926f8571450bafebd",
            topics: [
                "0f3c4eead59c3031944ce584c81a66dff04f5077b577bda67001192d80e1d885",
            ],
            data: "00000000000000000000000000000000000000000000000000000000000bfcbd0000000000000000000000000000000000000000000000000000000000000001",
        },
    ],
    internal_transactions: [
        {
            hash: "ec6d0f6699a429002750b543725b92d04b57fccfbdd6d2e9498fc04ff9e307a9",
            caller_address: "41596f27c0ec9cfd403da2019926f8571450bafebd",
            transferTo_address: "41309c64dab7d82443cded1ac9c2eb38269c35f6ee",
            callValueInfo: [{}],
            note: "63616c6c",
        },
        {
            hash: "8756aeda8e70ca010edbb8bf1ce82ae0e65cc3c4fdb2361f339588b5a6457a88",
            caller_address: "41596f27c0ec9cfd403da2019926f8571450bafebd",
            transferTo_address: "41309c64dab7d82443cded1ac9c2eb38269c35f6ee",
            callValueInfo: [{}],
            note: "63616c6c",
        },
        {
            hash: "7fac1371b45aa359ece46fd711030129762405fb29728f2de62afb8472045930",
            caller_address: "41596f27c0ec9cfd403da2019926f8571450bafebd",
            transferTo_address: "4195c80272e929bad06f5642036eb3219983d979dc",
            callValueInfo: [{}],
            note: "63616c6c",
        },
        {
            hash: "bd94143cdfe343e4eb0197a36c24c85f35760489626b46a9f3ce12c75d278e1a",
            caller_address: "41596f27c0ec9cfd403da2019926f8571450bafebd",
            transferTo_address: "4174b6ff6a481d19f6df9106fe5065ac245ce9872c",
            callValueInfo: [{}],
            note: "63616c6c",
        },
    ],
};
// https://github.com/ethereum/wiki/wiki/JSON-RPC#hex-value-encoding
ava_1.default("transaction.fromTron", (t) => {
    const ethTx = transaction.fromTron(tx, txInfo, "0xdeadbeef");
    t.deepEqual(ethTx, {
        blockHash: "0xdeadbeef",
        blockNumber: "0x529b3a",
        from: "0x95c80272e929bad06f5642036eb3219983d979dc",
        gas: "0x114e",
        gasPrice: "0x4a817c800",
        hash: "0x6895f86342677e118d821d2adda714bd55b165ee7162b9bd928253d857a0b082",
        input: "0x",
        nonce: "0x15",
        r: "0x0000000000000000000000000000000000000000000000000000000000000000",
        s: "0x0000000000000000000000000000000000000000000000000000000000000000",
        to: "0x596f27c0ec9cfd403da2019926f8571450bafebd",
        v: "0x0",
        value: "0x0",
    });
});
