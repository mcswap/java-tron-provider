import test from "ava";
import { dirname, join } from "path";
import createMapTruffleBytecode from "../src/createMapTruffleBytecode.js";
import fs from "fs/promises";
import Web3 from "web3";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const contractsPath = join(__dirname, "fixtures/build/contracts");

const loadContractInfo = async (name) => {
  const info = JSON.parse(
    await fs.readFile(join(contractsPath, "Migrations.json"))
  );
  return info;
};

test("mapTruffleBytecode", async (t) => {
  const info = await loadContractInfo("Migrations.json");

  const mapBytecode = createMapTruffleBytecode({
    contractsPath,
  });

  const res = await mapBytecode(info.bytecode);
  t.deepEqual(res, {
    name: info.contractName,
    abi: info.abi,
  });
});

test("mapTruffleBytecode (with constructor arguments)", async (t) => {
  const info = await loadContractInfo("SimpleStore.json");

  // web3 mutates this object
  const info2 = await loadContractInfo("SimpleStore.json");

  const mapBytecode = createMapTruffleBytecode({
    contractsPath,
  });

  const web3 = new Web3();
  const contract = new web3.eth.Contract(info2.abi);
  const tx = contract.deploy({
    data: info2.bytecode,
    arguments: [31337, 256],
  });

  const txData = tx.encodeABI();

  const res = await mapBytecode(txData);
  t.deepEqual(res, {
    name: info.contractName,
    abi: info.abi,
  });
});
