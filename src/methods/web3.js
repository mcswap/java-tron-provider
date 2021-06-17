import web3lib from "web3";
// import { notImplemented } from "./utils.js";

export const web3_clientVersion = async (params, ctx) => {
  const { data, ...rest } = await ctx.tronClient.post(
    "/wallet/getnodeinfo",
    {}
  );
  return data.configNodeInfo.codeVersion;
};

export const web3_sha3 = ([data], ctx) => {
  // TODO: return tron node version?
  const hash = web3lib.utils.sha3(data);
  return hash;
};
