import test from "ava";
import { formatQuantity } from "./index.js";

test("formatQuantity", (t) => {
  const s = formatQuantity("17");
  t.is(s, "0x11");
});
