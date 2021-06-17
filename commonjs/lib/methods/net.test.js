"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = __importDefault(require("ava"));
const index_js_1 = require("../index.js");
const net_js_1 = require("./net.js");
const networks_js_1 = require("../networks.js");
networks_js_1.networks.forEach(({ network, chainId }) => {
    ava_1.default(`eth_network (${network})`, async (t) => {
        const ctx = index_js_1.createContext({ network });
        const res = await net_js_1.net_version([], ctx);
        // console.log(res, network);
        t.deepEqual(res, `${chainId}`);
    });
});
