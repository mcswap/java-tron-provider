"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const simulateGetLogs_js_1 = __importDefault(require("./simulateGetLogs.js"));
const eventsApiGetLogs_js_1 = __importDefault(require("./eventsApiGetLogs.js"));
const debug_1 = __importDefault(require("debug"));
const debug = debug_1.default("java-tron-provider:warning");
async function eth_getLogs([filterObject], ctx) {
    if (ctx.tronEventsClient) {
        return eventsApiGetLogs_js_1.default([filterObject], ctx);
    }
    debug("unknown events API URL, eth_getLogs using slow method");
    return simulateGetLogs_js_1.default([filterObject], ctx);
}
exports.default = eth_getLogs;
