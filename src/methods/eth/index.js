// import web3lib from "web3";
// import { notImplemented } from "./utils.js";
import {
  formatQuantity,
  address as ethAddress,
  warn,
  hexToNumber,
  sunToWei,
  toBN,
} from "../utils/index.js";
import { ServerError } from "../../errors.js";
export * from "./getTransaction.js";
export { eth_sendRawTransaction } from "./sendRawTransaction.js";
export { eth_getBlockByHash, eth_getBlockByNumber } from "./getBlock.js";
export { eth_call } from "./call.js";
export { default as eth_getLogs } from "./getLogs/index.js";
export { eth_accounts } from "./accounts.js";
export { eth_sendTransaction } from "./sendTransaction.js";
export { eth_subscribe } from "./subscribe.js";
export { eth_getBalance } from "./getBalance.js";
export { eth_chainId } from "./chainId.js";
export { eth_estimateGas } from "./estimateGas.js";
// import qs from "querystring";

// just hardcoded to the protocol version returned by infura.io at time of writing htis
const PROTOCOL_VERSION = "0x40";

/**
 * Returns the current ethereum protocol version.
 *
 * Parameters
 * none
 *
 * Returns
 * String - The current ethereum protocol version.
 */
export const eth_protocolVersion = async (_params, ctx) => {
  return PROTOCOL_VERSION;
};

/**
 * Returns an object with data about the sync status or false.
 * Parameters
 * none
 *
 * Returns
 * Object|Boolean, An object with sync status data or FALSE, when not syncing:
 *
 * startingBlock: QUANTITY - The block at which the import started (will only be reset, after the sync reached his head)
 * currentBlock: QUANTITY - The current block, same as eth_blockNumber
 * highestBlock: QUANTITY - The estimated highest block
 */
export const eth_syncing = async (_params, ctx) => {
  // TODO
  return false;
};

// The address owned by the client that is used as default for things like the mining reward
/*
export const eth_coinbase = async (_params, _ctx) => {
  // infura returns this error as well so should be fine
};
*/

/**
 * Returns true if client is actively mining new blocks.
 *
 * Parameters
 * none
 *
 * Returns
 * Boolean - returns true of the client is mining, otherwise false.
 */
export const eth_mining = () => {
  // not important
  return false;
};

/**
 * eth_hashrate
 * Returns the number of hashes per second that the node is mining with.
 *
 * Parameters
 * none
 *
 * Returns
 * QUANTITY - number of hashes per second.
 */
export const eth_hashrate = () => {
  // not important
  return formatQuantity(0);
};

/**
 * eth_gasPrice
 * Returns the current price per gas in wei.
 *
 * Parameters
 * none
 *
 * Returns
 * QUANTITY - integer of the current gas price in wei.
 *
 */
export const eth_gasPrice = async (_, ctx) => {
  // not relevant for Tron...
  // Let's return price in sun for 1 energy/bandwidth
  const { data } = await ctx.tronClient.get("/wallet/getchainparameters");
  const p = data.chainParameter.find((param) => param.key === "getEnergyFee");
  if (!p) {
    throw new ServerError("could not find getEnergyFee chainparameter");
  }
  const fee = p.value;
  // 1 SUN = 0.000001
  // TODO: convert SUN to WEI?
  return formatQuantity(fee); // in SUN
};

/**
 * eth_blockNumber
 * Returns the number of most recent block.
 *
 * Parameters
 * none
 *
 * Returns
 * QUANTITY - integer of the current block number the client is on.
 */
export const eth_blockNumber = async (_, ctx) => {
  // not relevant for Tron...
  // Let's return price in sun for 1 energy/bandwidth
  const { data } = await ctx.tronClient.get("/wallet/getnowblock");
  const blockNum = data.block_header.raw_data.number;
  return formatQuantity(blockNum);
};

/**
 * eth_getStorageAt
 * Returns the value from a storage position at a given address.
 *
 * Parameters
 * DATA, 20 Bytes - address of the storage.
 * QUANTITY - integer of the position in the storage.
 * QUANTITY|TAG - integer block number, or the string "latest", "earliest" or "pending", see the default block parameter
 * Returns
 * DATA - the value at this storage position.
 */
/*
export const eth_getStorageAt = async (
  [_contractAddress, _position, _blockNum],
  ctx
) => {
  // TODO: Tron does not have this API, we would have to add it directly to Java-Tron's API
};
*/
export const eth_getStorageAt = async (_args, _ctx) => {
  // TODO: return actual contract storage... unfortunately not supported by java-tron api at moment
  return `0x0000000000000000000000000000000000000000000000000000000000000000`;
};

/**
 * eth_getTransactionCount
 * Returns the number of transactions sent from an address.
 *
 * Parameters
 * DATA, 20 Bytes - address.
 * QUANTITY|TAG - integer block number, or the string "latest", "earliest" or "pending", see the default block parameter
 *
 * Example Parameters
 * params: [
 *    '0xc94770007dda54cF92009BFF0dE90c06F603a09f',
 *    'latest' // state at the latest block
 * ]
 * Returns
 * QUANTITY - integer of the number of transactions send from this address.
 */
/*
export const eth_getTransactionCount = async ([account, blockNum], ctx) => {
  if (blockNum !== "latest") {
    // TODO: I don't believe tron api support querying balance amount using a block number parameter
    warn('eth_getTransactionCount: second argument defaulted to "latest"');
  }

  const address = ethAddress.toTron(account);
  const query = { only_from: true, limit: 200 };
  const { data } = await ctx.tronClient.get(
    `/v1/accounts/${address}/transactions?${qs.stringify(query)}`
  );
  // TODO: tron doesn't have equivalent API but we can get a list of transactions..
  // TODO: this will be incorrect past 200 transactions.. paginate?
  const count = data.data.length;
  if (count >= 200) {
    warn(
      "eth_getTransactionCount: the number of transaction does will stay at 200 after 200"
    );
  }
  return formatQuantity(count);
};
*/
export const eth_getTransactionCount = async ([account, blockNum], ctx) => {
  warn("eth_getTransactionCount: not implemented... always returns 0");
  // TODO: tron does not have an equivalent API call :(
  return formatQuantity(0);
};

/**
 * eth_getBlockTransactionCountByNumber
 * Returns the number of transactions in a block matching the given block number.
 *
 * Parameters
 * QUANTITY|TAG - integer of a block number, or the string "earliest", "latest" or "pending", as in the default block parameter.
 * Example Parameters
 * params: [
 *    '0xe8', // 232
 * ]
 * Returns
 * QUANTITY - integer of the number of transactions in this block.
 */
export const eth_getBlockTransactionCountByNumber = async ([blockNum], ctx) => {
  let num;
  if (blockNum === "latest") {
    const { data } = await ctx.tronClient.get("/wallet/getnowblock");
    num = data.block_header.raw_data.number;
  } else {
    num = hexToNumber(blockNum);
  }
  const { data } = await ctx.tronClient.post(
    `/wallet/gettransactioninfobyblocknum`,
    {
      num,
    }
  );
  const txNum = data.length;
  return formatQuantity(txNum);
};

/**
 * eth_getUncleCountByBlockHash
 * Returns the number of uncles in a block from a block matching the given block hash.
 *
 * Parameters
 * DATA, 32 Bytes - hash of a block.
 * Example Parameters
 * params: [
 *    '0xc94770007dda54cF92009BFF0dE90c06F603a09f'
 * ]
 * Returns
 * QUANTITY - integer of the number of uncles in this block.
 */
export const eth_getUncleCountByBlockHash = async ([blockHash], ctx) => {
  warn(
    "eth_getUncleCountByBlockHash: Tron does not seem to have a concept of 'uncles'"
  );
  return formatQuantity(0);
};
export const eth_getUncleCountByBlockNumber = async () => {
  warn(
    "eth_getUncleCountByBlockNumber: Tron does not seem to have a concept of 'uncles'"
  );
  return formatQuantity(0);
};

/**
 * eth_getCode
 * Returns code at a given address.
 *
 * Parameters
 * DATA, 20 Bytes - address.
 * QUANTITY|TAG - integer block number, or the string "latest", "earliest" or "pending", see the default block parameter.
 * Example Parameters
 * params: [
 *    '0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b',
 *    '0x2'  // 2
 * ]
 * Returns
 * DATA - the code from the given address.
 */
export const eth_getCode = async ([account, blockNum], ctx) => {
  if (blockNum !== "latest") {
    warn('eth_getCode: second argument defaulted to "latest"');
  }
  const address = ethAddress.toTron(account);
  const { data, ...rest } = await ctx.tronClient.post(`/wallet/getcontract`, {
    value: address,
    visible: true,
  });
  // java-tron returns { Error: 'class java.lang.NullPointerException :
  // null' } if contract does not exist
  if (data.Error) {
    // Ethereum RPC returns "0x" for non-existing contract
    return "0x";
  }
  return `0x${data.bytecode}`;
};

/**
 * eth_sign
 * The sign method calculates an Ethereum specific signature with:
 * sign(keccak256("\x19Ethereum Signed Message:\n" + len(message) + message))).
 *
 * By adding a prefix to the message makes the calculated signature
 * recognisable as an Ethereum specific signature. This prevents misuse where a
 * malicious DApp can sign arbitrary data (e.g. transaction) and use the
 * signature to impersonate the victim.
 *
 * Note the address to sign with must be unlocked.
 *
 * Parameters
 * account, message
 *
 * DATA, 20 Bytes - address.
 * DATA, N Bytes - message to sign.
 *
 * Returns
 * DATA: Signature
 */
/*
export const eth_sign = async ([_account, _message], ctx) => {
  // infura.io also does not support so should not be too important
};
*/

/*
 * eth_estimateGas
 * Generates and returns an estimate of how much gas is necessary to allow the transaction to complete. The transaction will not be added to the blockchain. Note that the estimate may be significantly more than the amount of gas actually used by the transaction, for a variety of reasons including EVM mechanics and node performance.
 *
 * Parameters
 * See eth_call parameters, expect that all properties are optional. If no gas limit is specified geth uses the block gas limit from the pending block as an upper bound. As a result the returned estimate might not be enough to executed the call/transaction when the amount of gas is higher than the pending block gas limit.
 *
 * Returns
 * QUANTITY - the amount of gas used.
 */
/*
export const eth_estimateGas = async (_params, _ctx) => {
  // Tron has no equivalent API call
  // https://github.com/tronprotocol/java-tron/issues/2982
};

export const eth_getUncleByBlockHashAndIndex = async (_params, _ctx) => {
  // Tron has no equivalent API call :(
};
export const eth_getUncleByBlockNumberAndIndex = async (_params, _ctx) => {
  // Tron has no equivalent API call :(
};
export const eth_newFilter = async (_params, _ctx) => {
  // Tron has no equivalent API call :(
};
export const eth_newBlockFilter = async (_params, _ctx) => {
  // Tron has no equivalent API call :(
};
export const eth_newPendingTransactionFilter = async (_params, _ctx) => {
  // Tron has no equivalent API call :(
};
export const eth_uninstallFilter = async (_params, _ctx) => {
  // Tron has no equivalent API call :(
};
export const eth_getFilterChanges = async (_params, _ctx) => {
  // Tron has no equivalent API call :(
};
export const eth_getFilterLogs = async (_params, _ctx) => {
  // Tron has no equivalent API call :(
};
// TODO: might be possible to simulate this...
export const eth_getWork = async (_params, _ctx) => {
  // Tron has no equivalent API call :(
};

export const eth_submitWork = async (_params, _ctx) => {
  // Tron has no equivalent API call :(
};

export const eth_submitHashrate = async (_params, _ctx) => {
  // Tron has no equivalent API call :(
};

export const eth_getProof = async (_params, _ctx) => {
  // Tron has no equivalent API call :(
};
*/
