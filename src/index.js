//https://github.com/MetaMask/metamask-extension/blob/master/app/scripts/controllers/network/createInfuraClient.js

import createContext from "./methods/createContext.js";
import createDebug from "debug";
import JsonRpcEngine from "json-rpc-engine";
import providerFromEngine from "./providerFromEngine.js";
import createAsyncMiddleware from "json-rpc-engine/src/createAsyncMiddleware.js";
import ethRpcErrors from "eth-rpc-errors";
import allMethods from "./methods/index.js";
import { address } from "./methods/utils/index.js";
import autoRetry from "./methods/autoRetry.js";
export { networks, getNetwork } from "./networks.js";
export { address as ethAddress };

export { createContext, providerFromEngine };

const debugRequest = createDebug("java-tron-provider:request");
const debugResponse = createDebug("java-tron-provider:response");
const debugError = createDebug("java-tron-provider:error");
const { ethErrors } = ethRpcErrors;

// example middleware (infura): https://raw.githubusercontent.com/MetaMask/eth-json-rpc-infura/master/src/index.js

// middleware for json-rpc-engine (that's what metamask uses to build web3 providers)
export function createJavaTronMiddleware({
  network = "mainnet",
  maxAttempts = 2,
  tronApiUrl,
  privateKey,
  // optional function used when creating contracts to publish contract name and abi.
  // since web3 doesn't pass this data directly, we need to infer it
  // from deployed bytecode alone!
  mapBytecode,
} = {}) {
  const ctx = createContext({ network, tronApiUrl, privateKey, mapBytecode });

  // validate options
  if (!maxAttempts) {
    throw new Error(
      `Invalid value for 'maxAttempts': "${maxAttempts}" (${typeof maxAttempts})`
    );
  }

  return createAsyncMiddleware(async (req, res) => {
    try {
      debugRequest(req);
      const methodName = req.method;
      const methodFn = allMethods[methodName];

      if (typeof methodFn !== "function") {
        throw ethErrors.rpc.methodNotSupported({
          message: `${methodName} not implemented by java-tron-provider middleware`,
        });
      }

      const retryOpts = { retries: maxAttempts };
      const result = await autoRetry(
        methodFn,
        retryOpts,
        methodName
      )(req.params, ctx);
      res.result = result;
      debugResponse(res);
    } catch (err) {
      debugError(err);
      throw err;
    }
  });
}

// https://github.com/MetaMask/metamask-extension/blob/652db3fd3676555929b09bbef1af5abe17ee9ece/app/scripts/controllers/network/network.js#L230
export function createJavaTronEngine(opts = {}) {
  const engine = new JsonRpcEngine();
  // engine.push(metamaskMiddleware);
  // engine.push(networkMiddleware);

  // TODO: cache middleware to minimize duplicate network requests?
  engine.push(createJavaTronMiddleware(opts));
  return engine;
}

export default function createJavaTronProvider(opts = {}) {
  const engine = createJavaTronEngine(opts);
  const provider = providerFromEngine(engine);
  return provider;
}
