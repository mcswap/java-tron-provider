"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.autoRetyAllMethods = void 0;
const promise_retry_1 = __importDefault(require("promise-retry"));
const debug_1 = __importDefault(require("debug"));
const debug = debug_1.default("java-tron-provider");
const RETRIABLE_ERRORS = [
    "Request failed with status code 503",
    "ETIMEDOUT",
    "ECONNRESET",
    "EHOSTUNREACH",
];
// wraps all methods on object with autoRetry
function autoRetyAllMethods(obj, retryOpts = {}) {
    return Object.keys(obj).reduce((acc, key) => {
        let val = obj[key];
        if (typeof val === "function") {
            val = autoRetry(val, retryOpts, key);
        }
        return { ...acc, [key]: val };
    }, {});
}
exports.autoRetyAllMethods = autoRetyAllMethods;
function isRetriableError(err) {
    // todo (only retry network related errors?
    const errMessage = err.toString();
    return RETRIABLE_ERRORS.some((phrase) => errMessage.includes(phrase));
}
function autoRetry(methodFn, retryOpts, operationName = "") {
    return async (...args) => {
        // TODO: wrap errors?
        return promise_retry_1.default(async (retry, attemptNum) => {
            try {
                const result = await methodFn(...args);
                return result;
            }
            catch (err) {
                if (isRetriableError(err)) {
                    if (operationName) {
                        debug(`${operationName} (attempt #${attemptNum}) failed`, err.toString());
                    }
                    return retry(err);
                }
                throw err;
            }
        }, retryOpts);
    };
}
exports.default = autoRetry;
