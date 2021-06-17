"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.web3_sha3 = exports.web3_clientVersion = void 0;
const web3_1 = __importDefault(require("web3"));
// import { notImplemented } from "./utils.js";
exports.web3_clientVersion = async (params, ctx) => {
    const { data, ...rest } = await ctx.tronClient.post("/wallet/getnodeinfo", {});
    return data.configNodeInfo.codeVersion;
};
exports.web3_sha3 = ([data], ctx) => {
    // TODO: return tron node version?
    const hash = web3_1.default.utils.sha3(data);
    return hash;
};
