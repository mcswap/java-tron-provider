import path from "path";
// TODO: when we can drop node v12 support: import fs from "fs/promises"
import fsNodeback from "fs";
const fs = fsNodeback.promises;

// convenience function when using java-tron-provider as a provider for
// truffle. reads all JSON files in contractsPath to try to find
// matching bytecode
export default function createMapTruffleBytecode({
  contractsPath = "./build/contracts/",
} = {}) {
  return async function mapBytecode(bytecode) {
    const files = await fs.readdir(contractsPath);
    const infos = await Promise.all(
      files.map(async (f) => {
        const content = await fs.readFile(path.join(contractsPath, f));
        const info = JSON.parse(content);
        return info;
      })
    );

    const matchingInfo = infos.find((info) => {
      // ignore contracts with no bytecode...
      if (info.bytecode == "0x") return false;
      // TODO: also check that decoding + encoding arguments results in same bytecode
      return bytecode.startsWith(info.bytecode.toLowerCase());
    });
    if (!matchingInfo) return;

    return {
      name: matchingInfo.contractName,
      abi: matchingInfo.abi,
    };
  };
}
