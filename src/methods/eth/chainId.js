import { numberToHex } from "../utils/index.js";

// https://eips.ethereum.org/EIPS/eip-695
export const eth_chainId = async (_params, ctx) => {
  const { data } = await ctx.tronClient.get(`/wallet/getnodeinfo`);
  const p2pVersion = data.configNodeInfo.p2pVersion;
  return numberToHex(p2pVersion);
};
