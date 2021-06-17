import {
  address as ethAddress,
  warn,
  maybeThrowJavaTronError,
  hexToNumber,
} from "../utils/index.js";
import ethRpcErrors from "eth-rpc-errors";

const { ethErrors } = ethRpcErrors;

/**
 * eth_call
 * Executes a new message call immediately without creating a transaction on the block chain.
 *
 * Parameters
 *
 * Object - The transaction call object
 *
 *   from: DATA, 20 Bytes - (optional) The address the transaction is sent from.
 *
 *   to: DATA, 20 Bytes - The address the transaction is directed to.
 *
 *   gas: QUANTITY - (optional) Integer of the gas provided for the transaction
 *   execution. eth_call consumes zero gas, but this parameter may be needed by
 *   some executions.
 *
 *   gasPrice: QUANTITY - (optional) Integer of the gasPrice used for each paid gas
 *
 *   value: QUANTITY - (optional) Integer of the value sent with this transaction
 *
 *   data: DATA - (optional) Hash of the method signature and encoded
 *   parameters. For details see Ethereum Contract ABI in the Solidity
 *   documentation
 *
 * QUANTITY|TAG - integer block number, or the string "latest", "earliest" or "pending", see the default block parameter
 *
 * Returns
 * DATA - the return value of executed contract.
 */
export const eth_call = async (
  [{ from, to, gas, gasPrice, value, data }, blockNum],
  ctx
) => {
  // TODO: metabase uses this onchain contract:
  // https://etherscan.io/address/0xb1f8e55c7f64d203c1400b9d8555d050f94adf39#code
  // We could publish the same contract on tron and map the address to corresponding tron address

  if (blockNum !== "latest") {
    warn('eth_getTransactionCount: second argument defaulted to "latest"');
  }
  warn("eth_call not fully implemented");

  // Notes:
  // Ethereum's API is significantly different from Tron here.
  //
  // In Tron, you pass a fuction selector in plain text and a parameter in hex
  // which encodes all parameters.
  //
  // In Ethereum, the function selector is a 4 bytes hash of the function
  // selector and parameters are just appended after that signature in a same
  // hex string.
  //
  // Using the tron on chain ABI, we could maybe map the ethereum function
  // selector signature to the corresponding function selector but this will
  // not work with "proxy contracts" since their ABI is not necessarily on
  // chain.
  //
  // https://solidity.readthedocs.io/en/v0.6.10/abi-spec.html
  // Keccak-256 hash of the signature of the function: leading 4 bytes

  // Possible solutions
  // 1) directly implement in tron a way to call methods using their signature
  //    hash instead of plain text (e.g. /tringgerconstantcontractsig)
  // 2) modify web3 to pass the non hashed function selector
  // 3) partial solution: use on chain abi to generate all possible method signature
  //    hashes and use that to determine which function selector the hash
  //    corresponds to (caveat: this wont work for proxy style contracts that
  //    don't have an on chain ABI)
  //

  // striop leading 0x
  let d = data.substr(2);
  // const functionSelector = d.substr(0, 8);
  const parameter = d.substr(8);
  const body = {
    visible: true,
    contract_address: ethAddress.toTron(to),
    // aggregate
    function_selector: "aggregate((address,bytes)[])",
    //
    // NOTE: passing call_value actually makes the transaction "fail" with a
    // warning message like:
    //
    //  result: {
    //    result: true,
    //    message: 'constant cannot set call value or call token value.'
    //  },
    //
    //  But constant_result still contains the correct result, lol!
    //call_value: hexToNumber(value || "0x0"),
    //data: data.substr(2), // strip leading 0x
    parameter,
  };
  if (from) {
    body.owner_address = ethAddress.toTron(from);
  } else {
    // Default to address 0...
    // ethAddress.toTron("0x0000000000000000000000000000000000000000")
    body.owner_address = "T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb";
  }

  const { data: res } = await ctx.tronClient.post(
    `/wallet/triggerconstantcontract`,
    // `/wallet/triggerconstantcontract`,
    body
  );
  maybeThrowJavaTronError(res);
  // TODO: is this alway array with one element?
  const resultHex = res.constant_result[0];

  return `0x${resultHex}`;
};
