"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toTronHex = exports.fromTronHex = exports.toTron = exports.fromTron = void 0;
// TODO: REMOVE ME! MOVED TO @opentron/tron-eth-conversions
const web3_1 = __importDefault(require("web3"));
const bs58check_1 = __importDefault(require("bs58check"));
// base58
exports.fromTron = (b58) => {
    const buf = bs58check_1.default.decode(b58);
    // remove leading "0x41" byte
    const buf2 = buf.slice(1);
    return web3_1.default.utils.toHex(buf2);
};
// base58
exports.toTron = (addr) => {
    const tronHex = exports.toTronHex(addr);
    const buf = Buffer.from(tronHex, "hex");
    return bs58check_1.default.encode(buf);
};
const zeroAddress = "0x0000000000000000000000000000000000000000";
exports.fromTronHex = (tronHex) => {
    // in tron private net, the genesis block contains non standard addresses, like
    // "3078303030303030303030303030303030303030303030"... this is an invalid
    // ethereum address and not documented in Tron so we just default to
    // translating it to the zero address
    const isStandardHexAddress = tronHex.substr(0, 2) === "41" && tronHex.length === 42;
    if (!isStandardHexAddress) {
        return zeroAddress;
    }
    const buf = Buffer.from(tronHex, "hex");
    // remove leading "0x41" byte
    const buf2 = buf.slice(1);
    return web3_1.default.utils.toHex(buf2);
};
exports.toTronHex = (addr) => {
    const tronHex = `41${addr.substr(2)}`;
    return tronHex;
};
