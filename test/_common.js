import test from "ava";

import { address as ethAddress } from "../src/methods/utils/index.js";

export const testAccounts = [
  // test connector 1
  "TAJLmoNzgYHDX5osdfa3c5s9G35fZMfaMT",
  // test connector 2
  "TBfAjdXMuo4rSGU8sT4rqRSFDZn1yLik8S",
  // test connector 3
  "TSTsLfQGzKrpU61LF7J3q4iiwnHBzAGLHC",
].map(ethAddress.fromTron);
