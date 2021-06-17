"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = __importDefault(require("ava"));
const index_js_1 = __importDefault(require("./index.js"));
ava_1.default("instantiate provider", async (t) => {
    const provider = index_js_1.default();
    t.is(typeof provider, "object");
    t.is(typeof provider.send, "function");
    t.is(typeof provider.sendAsync, "function");
});
