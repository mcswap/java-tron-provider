import test from "ava";
import createJavaTronProvider from "./index.js";

test("instantiate provider", async (t) => {
  const provider = createJavaTronProvider();
  t.is(typeof provider, "object");
  t.is(typeof provider.send, "function");
  t.is(typeof provider.sendAsync, "function");
});
