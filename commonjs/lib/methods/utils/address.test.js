"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = __importDefault(require("ava"));
const address = __importStar(require("./address.js"));
const testAccount = "TAJLmoNzgYHDX5osdfa3c5s9G35fZMfaMT";
// https://github.com/ethereum/wiki/wiki/JSON-RPC#hex-value-encoding
ava_1.default("address.fromTron", (t) => {
    const addr = address.fromTron(testAccount);
    t.is(addr, "0x039e63f8d70becdaba64a45091688a8446d57689");
});
ava_1.default("address.toTron", (t) => {
    const addr = address.toTron("0x039e63f8d70becdaba64a45091688a8446d57689");
    t.is(addr, testAccount);
});
