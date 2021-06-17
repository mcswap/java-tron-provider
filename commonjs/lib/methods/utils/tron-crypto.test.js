"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = __importDefault(require("ava"));
const tronweb_1 = __importDefault(require("tronweb"));
const tron_crypto_js_1 = require("./tron-crypto.js");
async function signTransactionWithTronWeb(transaction, privateKey) {
    function createTronWeb(privateKey) {
        const providerUrl = "https://app.mcswap.io";
        const HttpProvider = tronweb_1.default.providers.HttpProvider;
        const fullNode = new HttpProvider(providerUrl);
        const solidityNode = new HttpProvider(providerUrl);
        const eventServer = new HttpProvider(providerUrl);
        const tronWeb = new tronweb_1.default(fullNode, solidityNode, eventServer, privateKey);
        return tronWeb;
    }
    const tronWeb = createTronWeb(privateKey);
    // must copy object, otherwise tronweb mutates it
    return await tronWeb.trx.sign({ ...transaction }, privateKey);
}
ava_1.default("sign transaction matches tronweb sign transaction", async (t) => {
    const privateKey = "52087001767e9c30288232baa07d3ac5cf0e3c8de30a49b98424ccf9b92e2dfd";
    const tx = {
        visible: false,
        txID: "7534dd14028fa29ed8ce7a3a5ba367d7f7c33c48898a698d221265121154189b",
        raw_data: {
            contract: [
                {
                    parameter: {
                        value: {
                            amount: 1000000,
                            owner_address: "41039e63f8d70becdaba64a45091688a8446d57689",
                            to_address: "411286df686b80bd49e20f0bb54671bd99b61b9993",
                        },
                        type_url: "type.googleapis.com/protocol.TransferContract",
                    },
                    type: "TransferContract",
                },
            ],
            ref_block_bytes: "df50",
            ref_block_hash: "9c786f28ced06f63",
            expiration: 1597888395000,
            timestamp: 1597888336960,
        },
        raw_data_hex: "0a02df5022089c786f28ced06f6340f8edc7ccc02e5a67080112630a2d747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e5472616e73666572436f6e747261637412320a1541039e63f8d70becdaba64a45091688a8446d576891215411286df686b80bd49e20f0bb54671bd99b61b999318c0843d70c0a8c4ccc02e",
    };
    const tronWebSignedTx = await signTransactionWithTronWeb(tx, privateKey);
    // console.log({ tronWebSignedTx, tx });
    const signedTx = tron_crypto_js_1.signTransaction(tx, privateKey);
    // console.log({ signedTx });
    t.deepEqual(signedTx, tronWebSignedTx);
});
