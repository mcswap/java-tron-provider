export default async (blockNum, ctx) => {
  const { data } = await ctx.tronClient.post("/wallet/getblockbynum", {
    num: blockNum,
  });
  return data.blockID;
};
