// chainId = p2pVersion in tron
// TRON networks
export const networks = [
  {
    chainId: 11111,
    network: "mainnet",
    genesisBlockHash:
      "0x00000000000000001ebf88508a03865c71d452e25f4d51194196a1d22b6653dc",
  },
  {
    chainId: 201910292,
    network: "nile",
    genesisBlockHash:
      "0x0000000000000000d698d4192c56cb6be724a558448e2684802de4d6cd8690dc",
  },
  {
    chainId: 1,
    network: "shasta",
    genesisBlockHash:
      "0x0000000000000000de1aa88295e1fcf982742f773e0419c5a9c134c994a9059e",
  },
];

export function getNetwork(networkName_) {
  const networkName = networkName_.toLowerCase();
  const network = networks.find((n) => n.network === networkName);
  if (!network) {
    throw new Error(
      `unknown network with name "${networkName}". possible values: ${networks
        .map((n) => n.network)
        .join(", ")}`
    );
  }
  return network;
}

export default networks;
