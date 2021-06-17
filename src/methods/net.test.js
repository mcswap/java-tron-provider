import test from "ava";
import { createContext } from "../index.js";
import { net_version } from "./net.js";
import { networks } from "../networks.js";

networks.forEach(({ network, chainId }) => {
  test(`eth_network (${network})`, async (t) => {
    const ctx = createContext({ network });
    const res = await net_version([], ctx);
    // console.log(res, network);
    t.deepEqual(res, `${chainId}`);
  });
});
