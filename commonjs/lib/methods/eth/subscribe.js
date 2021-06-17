"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eth_subscribe = void 0;
// TODO: implement eth_subscribe... simulate via polling or use tron's subscribe API?
const eth_rpc_errors_1 = __importDefault(require("eth-rpc-errors"));
const { ethErrors } = eth_rpc_errors_1.default;
exports.eth_subscribe = async (params, ctx) => {
    throw ethErrors.rpc.methodNotSupported({
        message: `eth_subscribe is not supported`,
    });
    // throw ethErrors.rpc.invalidInput(`missing data or value property`);
};
