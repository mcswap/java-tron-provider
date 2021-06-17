# @mcswap/java-tron-provider

[Web3.js compatible provider](https://eips.ethereum.org/EIPS/eip-1193) that uses the `java-tron` HTTP API.

## Install

Library:

```sh
npm install https://github/mcswap/java-tron-provider
```

Proxy server:

```sh
npm install -g https://github/mcswap/java-tron-provider
TRON_NETWORK=nile java-tron-web3-proxy
```

## Usage

```javascript
import Web3 from "web3";
import createJavaTronProvider from "@mcswap/java-tron-provider";

const provider = createJavaTronProvider({
  network: "nile", // defaults to mainnet
  privateKey: "priv key...", // only required if sending transactions
  // (optional) function that maps bytecode to { name, abi } object.
  mapBytecode: (bytecode) => {
    // e.g.:
    if (bytecode === "0xdeadbeef") {
      return {
        name: "MappedName",
        abi: [
          /* some abi */
        ],
      };
    }
  },
});

const web3 = new Web3(provider);

// ... etc.
```

_mapBytecode_(optional): Tron supports publishing an ABI and contract
name when deploying a contract but web3 only passes the bytecode to the
provider. This function helps the provider map the bytecode to a `{ name, abi }` object.

See [./test/web3.js](./test/web3.js) for more usage examples.

See [../truffle-tron-demo](../truffle-tron-demo) for usage example with
Truffle.

## Proxy Server

Runs the java-tron provider as a JSON-RPC HTTP server.

Example usage:

```bash
# start server
node bin/proxy-server.js
# start server for nile
TRON_NETWORK=nile node bin/proxy-server.js
```

Use server as regular Ethereum JSON-RPC API server:

```bash
curl \
  --data '{"method":"eth_getBlockByNumber","params":["latest", true],"id":1,"jsonrpc":"2.0"}' \
  -H "Content-Type: application/json" \
  -X POST localhost:8333 \
  | jq
```

Optional Configuration:

See config object at top of [./bin/proxy-server.js](./bin/proxy-server.js) for latest
documentation.

```bash
IP_ADDRESS=<ip address to bind to>
PORT=<port to bind>
TRON_NETWORK=<tron network>
# defaults to selecting node based on TRON_NETWORK
TRON_NODE=<tron node>
# enable verbose output (logs JSON-RPC requests)
# can also be used as CLI flag --verbose
# defaults to false
VERBOSE=1
# debug logs:
DEBUG=java-tron-provider
```

