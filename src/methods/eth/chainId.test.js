import test from "ava";
import { hexToNumber } from "../utils/index.js";
import { createContext } from "../../index.js";
import { eth_chainId } from "./chainId.js";
import { networks } from "../../networks.js";

networks.forEach(({ network, chainId }) => {
  test(`eth_chainId (${network})`, async (t) => {
    const ctx = createContext({ network });
    const res = await eth_chainId([], ctx);
    // console.log(hexToNumber(res), network);
    t.deepEqual(hexToNumber(res), chainId);
  });
});
