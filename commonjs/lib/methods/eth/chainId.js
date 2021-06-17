"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eth_chainId = void 0;
const index_js_1 = require("../utils/index.js");
// https://eips.ethereum.org/EIPS/eip-695
exports.eth_chainId = async (_params, ctx) => {
    const { data } = await ctx.tronClient.get(`/wallet/getnodeinfo`);
    const p2pVersion = data.configNodeInfo.p2pVersion;
    return index_js_1.numberToHex(p2pVersion);
};
