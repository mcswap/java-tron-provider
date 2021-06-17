"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eth_estimateGas = void 0;
const index_js_1 = require("../utils/index.js");
// 1 Energy = 100 SUN
async function eth_estimateGas(params, ctx) {
    // TODO
    // java-tron does not support equivalent API call so we just return the max energy limit...
    // 1 energy = 100 SUN
    return index_js_1.numberToHex(1e9);
}
exports.eth_estimateGas = eth_estimateGas;
