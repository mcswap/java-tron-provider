import { formatQuantity, warn, sunToWei, toBN } from "../utils/index.js";
import { address as ethAddress } from "../utils/index.js";

/**
 * eth_getBalance
 * Returns the balance of the account of given address.
 *
 * Parameters
 * DATA, 20 Bytes - address to check for balance.
 * QUANTITY|TAG - integer block number, or the string "latest", "earliest" or "pending", see the default block parameter
 */
export const eth_getBalance = async ([account, blockNum], ctx) => {
  if (blockNum !== "latest") {
    // TODO: I don't believe tron api support querying balance amount using a block number parameter
    warn(
      `eth_getBalance does not support historical balance "${blockNum}", second argument defaulted to "latest"`
    );
  }
  // not relevant for Tron...
  const address = ethAddress.toTronHex(account);
  // Let's return price in sun for 1 energy/bandwidth
  const { data } = await ctx.tronClient.post(`/wallet/getaccount`, { address });
  // contract account
  // account not found
  if (Object.keys(data).length === 0) {
    return formatQuantity(0);
  }
  // TODO: we probably should not convert to wei... just need to adjust number formatting in UI
  const balance = toBN(data.balance || 0);

  // Most ethereum tools crash if negative balance returned so we return 0 instead...
  if (balance.lt(toBN(0))) {
    return formatQuantity(toBN(0));
  }

  return formatQuantity(balance);
};
