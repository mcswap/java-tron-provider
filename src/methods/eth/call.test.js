import test from "ava";
import * as eth_ from "./index.js";
import { autoRetyAllMethods } from "../autoRetry.js";
// import { numberToHex } from "../utils/index.js";
import { createContext } from "../../index.js";
// import config from "../../config.js";
import { address as ethAddress } from "../utils/index.js";
import Web3 from "web3";

const eth = autoRetyAllMethods(eth_);

const web3 = new Web3();

import { createRequire } from "module";

const require = createRequire(import.meta.url);
// testAddress
// connector 1
const testAddress = ethAddress.fromTron("TAJLmoNzgYHDX5osdfa3c5s9G35fZMfaMT");

// config.set("tronNodeAddress", "http://localhost:18190");

const context = createContext({ network: "shasta" });

// TODO: move this test to shasta
test.skip("eth_call - isOwnerMe()", async (t) => {
  const bountyContractInfo = require("../../../fixtures/build/contracts/Bounty.json");
  const contractAddress = ethAddress.fromTronHex(
    bountyContractInfo.networks["9"].address
  );

  const functionSig = web3.eth.abi.encodeFunctionSignature("isOwnerMe()");
  const encodedParams = "";
  const data = `${functionSig}${encodedParams}`;

  const res = await eth.eth_call(
    [
      {
        from: testAddress, // optional
        to: contractAddress,
        /*
        gas: 0,
        gasPrice: 0,
        */
        value: 0,
        data,
      },
      "latest",
    ],
    context
  );

  const result = web3.eth.abi.decodeParameter("bool", res);
  t.deepEqual(result, false);
});

test.skip("eth_call - multiply(n1, n2)", async (t) => {
  const bountyContractInfo = require("../../../fixtures/build/contracts/Bounty.json");
  const contractAddress = ethAddress.fromTronHex(
    bountyContractInfo.networks["9"].address
  );

  const jsonInterface = bountyContractInfo.abi.find(
    (abi) => abi.name === "multiply"
  );
  const parameters = ["6", "5"];
  const data = web3.eth.abi.encodeFunctionCall(jsonInterface, parameters);

  // console.log({ data });

  const res = await eth.eth_call(
    [
      {
        from: testAddress, // optional
        to: contractAddress,
        /*
        gas: 0,
        gasPrice: 0,
        */
        value: 0,
        data,
      },
      "latest",
    ],
    context
  );

  const result = web3.eth.abi.decodeParameter("uint256", res);
  t.deepEqual(result, "30");
});
