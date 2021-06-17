import { numberToHex } from "../utils/index.js";

// 1 Energy = 100 SUN
export async function eth_estimateGas(params, ctx) {
  // TODO
  // java-tron does not support equivalent API call so we just return the max energy limit...
  // 1 energy = 100 SUN
  return numberToHex(1e9);
}
