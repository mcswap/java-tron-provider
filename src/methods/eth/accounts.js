import ethRpcErrors from "eth-rpc-errors";
import Web3 from "web3";

const web3 = new Web3();

// const { ethErrors } = ethRpcErrors;

/**
 * eth_accounts
 * Returns a list of addresses owned by client.
 *
 * Parameters
 * none
 *
 * Returns
 * Array of DATA, 20 Bytes - addresses owned by the client.
 */
export const eth_accounts = async (_params, ctx) => {
  if (ctx.privateKey) {
    const { privateKey } = ctx;
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);
    const address = account.address;
    return [address];
  }

  return [];
};
