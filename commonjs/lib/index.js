"use strict";
//https://github.com/MetaMask/metamask-extension/blob/master/app/scripts/controllers/network/createInfuraClient.js
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createJavaTronEngine = exports.createJavaTronMiddleware = exports.providerFromEngine = exports.createContext = exports.getNetwork = exports.networks = exports.ethAddress = void 0;
const createContext_js_1 = __importDefault(require("./methods/createContext.js"));
exports.createContext = createContext_js_1.default;
const ethAddress_js_1 = require("./methods/utils/address.js");
exports.ethAddress = ethAddress_js_1;
const debug_1 = __importDefault(require("debug"));
const json_rpc_engine_1 = __importDefault(require("json-rpc-engine"));
const providerFromEngine_js_1 = __importDefault(require("./providerFromEngine.js"));
exports.providerFromEngine = providerFromEngine_js_1.default;
const createAsyncMiddleware_js_1 = __importDefault(require("json-rpc-engine/src/createAsyncMiddleware.js"));
const eth_rpc_errors_1 = __importDefault(require("eth-rpc-errors"));
const index_js_1 = __importDefault(require("./methods/index.js"));
const autoRetry_js_1 = __importDefault(require("./methods/autoRetry.js"));
var networks_js_1 = require("./networks.js");
Object.defineProperty(exports, "networks", { enumerable: true, get: function () { return networks_js_1.networks; } });
Object.defineProperty(exports, "getNetwork", { enumerable: true, get: function () { return networks_js_1.getNetwork; } });
const debugRequest = debug_1.default("java-tron-provider:request");
const debugResponse = debug_1.default("java-tron-provider:response");
const debugError = debug_1.default("java-tron-provider:error");
const { ethErrors } = eth_rpc_errors_1.default;
// example middleware (infura): https://raw.githubusercontent.com/MetaMask/eth-json-rpc-infura/master/src/index.js
// middleware for json-rpc-engine (that's what metamask uses to build web3 providers)
function createJavaTronMiddleware({ network = "mainnet", maxAttempts = 2, tronApiUrl, privateKey, 
// optional function used when creating contracts to publish contract name and abi.
// since web3 doesn't pass this data directly, we need to infer it
// from deployed bytecode alone!
mapBytecode, } = {}) {
    const ctx = createContext_js_1.default({ network, tronApiUrl, privateKey, mapBytecode });
    // validate options
    if (!maxAttempts) {
        throw new Error(`Invalid value for 'maxAttempts': "${maxAttempts}" (${typeof maxAttempts})`);
    }
    return createAsyncMiddleware_js_1.default(async (req, res) => {
        try {
            debugRequest(req);
            const methodName = req.method;
            const methodFn = index_js_1.default[methodName];
            if (typeof methodFn !== "function") {
                throw ethErrors.rpc.methodNotSupported({
                    message: `${methodName} not implemented by java-tron-provider middleware`,
                });
            }
            const retryOpts = { retries: maxAttempts };
            const result = await autoRetry_js_1.default(methodFn, retryOpts, methodName)(req.params, ctx);
            res.result = result;
            debugResponse(res);
        }
        catch (err) {
            debugError(err);
            throw err;
        }
    });
}
exports.createJavaTronMiddleware = createJavaTronMiddleware;
// https://github.com/MetaMask/metamask-extension/blob/652db3fd3676555929b09bbef1af5abe17ee9ece/app/scripts/controllers/network/network.js#L230
function createJavaTronEngine(opts = {}) {
    const engine = new json_rpc_engine_1.default();
    // engine.push(metamaskMiddleware);
    // engine.push(networkMiddleware);
    // TODO: cache middleware to minimize duplicate network requests?
    engine.push(createJavaTronMiddleware(opts));
    return engine;
}
exports.createJavaTronEngine = createJavaTronEngine;
function createJavaTronProvider(opts = {}) {
    const engine = createJavaTronEngine(opts);
    const provider = providerFromEngine_js_1.default(engine);
    return provider;
}
exports.default = createJavaTronProvider;
