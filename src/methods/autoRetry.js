import promiseRetry from "promise-retry";
import createDebug from "debug";

const debug = createDebug("java-tron-provider");

const RETRIABLE_ERRORS = [
  "Request failed with status code 503",
  "ETIMEDOUT",
  "ECONNRESET",
  "EHOSTUNREACH",
];

// wraps all methods on object with autoRetry
export function autoRetyAllMethods(obj, retryOpts = {}) {
  return Object.keys(obj).reduce((acc, key) => {
    let val = obj[key];
    if (typeof val === "function") {
      val = autoRetry(val, retryOpts, key);
    }
    return { ...acc, [key]: val };
  }, {});
}

function isRetriableError(err) {
  // todo (only retry network related errors?
  const errMessage = err.toString();
  return RETRIABLE_ERRORS.some((phrase) => errMessage.includes(phrase));
}

export default function autoRetry(methodFn, retryOpts, operationName = "") {
  return async (...args) => {
    // TODO: wrap errors?
    return promiseRetry(async (retry, attemptNum) => {
      try {
        const result = await methodFn(...args);
        return result;
      } catch (err) {
        if (isRetriableError(err)) {
          if (operationName) {
            debug(
              `${operationName} (attempt #${attemptNum}) failed`,
              err.toString()
            );
          }
          return retry(err);
        }
        throw err;
      }
    }, retryOpts);
  };
}
