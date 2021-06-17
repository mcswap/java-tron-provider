// import { ServerError } from "../../errors.js";
import web3lib from "web3";
import * as transaction from "./transaction.js";
import * as transactionReceipt from "./transactionReceipt.js";
import * as block from "./block.js";
import * as address from "./address.js";
import createDebug from "debug";
import ethRpcErrors from "eth-rpc-errors";

export const warn = createDebug("java-tron-provider:warn");

const {
  utils: { hexToNumber, numberToHex, keccak256, toBN },
} = web3lib;

export {
  transaction,
  transactionReceipt,
  block,
  address,
  hexToNumber,
  keccak256,
  numberToHex,
  toBN,
};

// https://github.com/ethereum/wiki/wiki/JSON-RPC#hex-value-encoding
export const formatQuantity = (n) => {
  return web3lib.utils.numberToHex(n);
};

export const sunToWei = (n) => {
  // eth decimals: 18
  // trx decimals: 6
  // delta: 18 - 6 = 12
  return toBN(n).mul(toBN(10).pow(toBN(12)));
};

export function maybeThrowJavaTronError(data) {
  const { ethErrors } = ethRpcErrors;
  // sometimes error look like `{ code ,txid, message }` and sometimes
  // like `{ result: { code, txid, message } }` ....
  const result = data.result || data;
  if (typeof result === "object" && result && result.code && result.message) {
    // TODO: map java-tron error codes to correct rpc errors...

    // TODO: handle this res:
    /*
       {"result":{"code":"CONTRACT_VALIDATE_ERROR","message":"No contract or not a smart contract"}}
     */
    throw ethErrors.rpc.resourceNotFound({
      message: `${result.code}: ${result.message}`,
      data: result,
    });
  }
}
