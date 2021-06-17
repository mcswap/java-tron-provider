"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = __importDefault(require("ava"));
const index_js_1 = require("./index.js");
ava_1.default("formatQuantity", (t) => {
    const s = index_js_1.formatQuantity("17");
    t.is(s, "0x11");
});
