"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eth_getBalance = void 0;
const index_js_1 = require("../utils/index.js");
const ethAddress = require("../utils/index.js");
/**
 * eth_getBalance
 * Returns the balance of the account of given address.
 *
 * Parameters
 * DATA, 20 Bytes - address to check for balance.
 * QUANTITY|TAG - integer block number, or the string "latest", "earliest" or "pending", see the default block parameter
 */
exports.eth_getBalance = async ([account, blockNum], ctx) => {
    if (blockNum !== "latest") {
        // TODO: I don't believe tron api support querying balance amount using a block number parameter
        index_js_1.warn(`eth_getBalance does not support historical balance "${blockNum}", second argument defaulted to "latest"`);
    }
    // not relevant for Tron...
    const address = ethAddress.toTronHex(account);
    // Let's return price in sun for 1 energy/bandwidth
    const { data } = await ctx.tronClient.post(`/wallet/getaccount`, { address });
    // contract account
    // account not found
    if (Object.keys(data).length === 0) {
        return index_js_1.formatQuantity(0);
    }
    // TODO: we probably should not convert to wei... just need to adjust number formatting in UI
    const balance = index_js_1.toBN(data.balance || 0);
    // Most ethereum tools crash if negative balance returned so we return 0 instead...
    if (balance.lt(index_js_1.toBN(0))) {
        return index_js_1.formatQuantity(index_js_1.toBN(0));
    }
    return index_js_1.formatQuantity(balance);
};
