"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = __importDefault(require("ava"));
const index_js_1 = require("../utils/index.js");
const index_js_2 = require("../../index.js");
const chainId_js_1 = require("./chainId.js");
const networks_js_1 = require("../../networks.js");
networks_js_1.networks.forEach(({ network, chainId }) => {
    ava_1.default(`eth_chainId (${network})`, async (t) => {
        const ctx = index_js_2.createContext({ network });
        const res = await chainId_js_1.eth_chainId([], ctx);
        // console.log(hexToNumber(res), network);
        t.deepEqual(index_js_1.hexToNumber(res), chainId);
    });
});
