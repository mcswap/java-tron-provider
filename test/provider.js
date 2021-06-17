import test from "ava";
import createJavaTronProvider from "../src/index.js";

test("web3_clientVersion shasta", async (t) => {
  const provider = createJavaTronProvider({ network: "shasta" });

  // TODO: why .request() not available? request is recommended API for
  // web3 provider according to EIP 1193 (send and sendAsync are
  // deprecated)
  const res = await provider.sendAsync({
    method: "web3_clientVersion",
    params: [],
    id: 1,
  });
  t.deepEqual(res, { id: 1, result: "4.1.3", jsonrpc: undefined });
});

test("web3_clientVersion nile", async (t) => {
  const provider = createJavaTronProvider({ network: "nile" });

  // TODO: why .request() not available? request is recommended API for
  // web3 provider according to EIP 1193 (send and sendAsync are
  // deprecated)
  const res = await provider.sendAsync({
    method: "web3_clientVersion",
    params: [],
    id: 1,
  });
  t.deepEqual(res, { id: 1, result: "4.2.0", jsonrpc: undefined });
});
