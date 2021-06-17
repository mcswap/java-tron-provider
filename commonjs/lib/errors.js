"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerError = exports.ClientError = void 0;
// TODO: replace with eth-rpc-errors
class ClientError extends Error {
    constructor(message, code = -32601) {
        super(message);
        this.code = code;
    }
}
exports.ClientError = ClientError;
class ServerError extends Error {
    constructor(message, code = -32601) {
        super(message);
        this.code = code;
    }
}
exports.ServerError = ServerError;
