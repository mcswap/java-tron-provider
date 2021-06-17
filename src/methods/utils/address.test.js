import test from "ava";
import * as address from "./address.js";

const testAccount = "TAJLmoNzgYHDX5osdfa3c5s9G35fZMfaMT";

// https://github.com/ethereum/wiki/wiki/JSON-RPC#hex-value-encoding
test("address.fromTron", (t) => {
  const addr = address.fromTron(testAccount);
  t.is(addr, "0x039e63f8d70becdaba64a45091688a8446d57689");
});

test("address.toTron", (t) => {
  const addr = address.toTron("0x039e63f8d70becdaba64a45091688a8446d57689");
  t.is(addr, testAccount);
});
