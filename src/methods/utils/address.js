// TODO: REMOVE ME! MOVED TO @opentron/tron-eth-conversions
import Web3 from "web3";
import bs58 from "bs58check";

// base58
export const fromTron = (b58) => {
  const buf = bs58.decode(b58);
  // remove leading "0x41" byte
  const buf2 = buf.slice(1);
  return Web3.utils.toHex(buf2);
}
// base58
export const toTron = (addr) => {
  const tronHex = toTronHex(addr);
  const buf = Buffer.from(tronHex, "hex");
  return bs58.encode(buf);
}

const zeroAddress = "0x0000000000000000000000000000000000000000";

export const fromTronHex = (tronHex) => {
  // in tron private net, the genesis block contains non standard addresses, like
  // "3078303030303030303030303030303030303030303030"... this is an invalid
  // ethereum address and not documented in Tron so we just default to
  // translating it to the zero address
  const isStandardHexAddress =
    tronHex.substr(0, 2) === "41" && tronHex.length === 42;
  if (!isStandardHexAddress) {
    return zeroAddress;
  }

  const buf = Buffer.from(tronHex, "hex");
  // remove leading "0x41" byte
  const buf2 = buf.slice(1);
  return Web3.utils.toHex(buf2);
}
export const toTronHex = (addr) => {
  const tronHex = `41${addr.substr(2)}`;
  return tronHex;
}
