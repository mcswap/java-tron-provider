"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eth_pendingTransactions = exports.eth_getTransactionReceipt = exports.eth_getTransactionByBlockNumberAndIndex = exports.eth_getTransactionByBlockHashAndIndex = exports.eth_getTransactionByHash = void 0;
// import web3lib from "web3";
// import { notImplemented } from "./utils.js";
const errors_js_1 = require("../../errors.js");
const index_js_1 = require("../utils/index.js");
/*
#### eth_getTransactionByHash

Returns the information about a transaction requested by transaction hash.


##### Parameters

1. `DATA`, 32 Bytes - hash of a transaction

##### Example Parameters
```js
params: [
   "0x88df016429689c079f3b2f6ad39fa052532c56795b733da78a91ebe6a713944b"
]
```

##### Returns

`Object` - A transaction object, or `null` when no transaction was found:

  - `blockHash`: `DATA`, 32 Bytes - hash of the block where this transaction was in. `null` when its pending.
  - `blockNumber`: `QUANTITY` - block number where this transaction was in. `null` when its pending.
  - `from`: `DATA`, 20 Bytes - address of the sender.
  - `gas`: `QUANTITY` - gas provided by the sender.
  - `gasPrice`: `QUANTITY` - gas price provided by the sender in Wei.
  - `hash`: `DATA`, 32 Bytes - hash of the transaction.
  - `input`: `DATA` - the data send along with the transaction.
  - `nonce`: `QUANTITY` - the number of transactions made by the sender prior to this one.
  - `to`: `DATA`, 20 Bytes - address of the receiver. `null` when its a contract creation transaction.
  - `transactionIndex`: `QUANTITY` - integer of the transaction's index position in the block. `null` when its pending.
  - `value`: `QUANTITY` - value transferred in Wei.
  - `v`: `QUANTITY` - ECDSA recovery id
  - `r`: `QUANTITY` - ECDSA signature r
  - `s`: `QUANTITY` - ECDSA signature s

##### Example
```js
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_getTransactionByHash","params":["0x88df016429689c079f3b2f6ad39fa052532c56795b733da78a91ebe6a713944b"],"id":1}'

// Result
{
  "jsonrpc":"2.0",
  "id":1,
  "result":{
    "blockHash":"0x1d59ff54b1eb26b013ce3cb5fc9dab3705b415a67127a003c3e61eb445bb8df2",
    "blockNumber":"0x5daf3b", // 6139707
    "from":"0xa7d9ddbe1f17865597fbd27ec712455208b6b76d",
    "gas":"0xc350", // 50000
    "gasPrice":"0x4a817c800", // 20000000000
    "hash":"0x88df016429689c079f3b2f6ad39fa052532c56795b733da78a91ebe6a713944b",
    "input":"0x68656c6c6f21",
    "nonce":"0x15", // 21
    "to":"0xf02c1c8e6114b1dbe8937a39260b5b0a374432bb",
    "transactionIndex":"0x41", // 65
    "value":"0xf3dbb76162000", // 4290000000000000
    "v":"0x25", // 37
    "r":"0x1b5e176d927f8e9ab405058b2d2457392da3e20f328b16ddabcebc33eaac5fea",
    "s":"0x4ba69724e8f69de52f0125ad8b3c5c2cef33019bac3249e2c0a2192766d1721c"
  }
}
```
*/
exports.eth_getTransactionByHash = async ([txHash], ctx) => {
    // strip leading 0x
    let hash = txHash.substr(2);
    const body = {
        value: hash,
    };
    // console.log(body);
    const [{ data: txInfo }, { data: tx }] = await Promise.all([
        ctx.tronClient.post(`/wallet/gettransactioninfobyid`, body),
        ctx.tronClient.post(`/wallet/gettransactionbyid`, body),
    ]);
    if (!Object.keys(txInfo).length) {
        return null;
    }
    const { data: block } = await ctx.tronClient.post(`/wallet/getblockbynum`, {
        num: txInfo.blockNumber,
    });
    const blockHash = `0x${block.blockID}`;
    // console.log({ tx, txInfo, block });
    return index_js_1.transaction.fromTron(tx, txInfo, blockHash);
};
/**
#### eth_getTransactionByBlockHashAndIndex

Returns information about a transaction by block hash and transaction index position.


##### Parameters

1. `DATA`, 32 Bytes - hash of a block.
2. `QUANTITY` - integer of the transaction index position.

##### Example Parameters
```js
params: [
   '0xe670ec64341771606e55d6b4ca35a1a6b75ee3d5145a99d05921026d1527331',
   '0x0' // 0
]
```

##### Returns

See [eth_getTransactionByHash](#eth_gettransactionbyhash)

##### Example
```js
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_getTransactionByBlockHashAndIndex","params":["0xc6ef2fc5426d6ad6fd9e2a26abeab0aa2411b7ab17f30a99d3cb96aed1d1055b", "0x0"],"id":1}'
```

Result see [eth_getTransactionByHash](#eth_gettransactionbyhash)

*/
exports.eth_getTransactionByBlockHashAndIndex = async ([_blockHash, _idx], ctx) => {
    const idx = index_js_1.hexToNumber(_idx);
    // strip leading 0x
    const blockHash = _blockHash.substr(2);
    const body = { value: blockHash };
    const { data: block } = await ctx.tronClient.post("/wallet/getblockbyid", body);
    if (!Object.keys(block).length) {
        throw new errors_js_1.ClientError(`Unknown block ${blockHash}`);
    }
    /*
    console.dir(
      block.transactions.map((tx) => tx.txID),
      { depth: null }
    );
    */
    const tx = block.transactions[idx];
    return exports.eth_getTransactionByHash([`0x${tx.txID}`], ctx);
};
/*
#### eth_getTransactionByBlockNumberAndIndex

Returns information about a transaction by block number and transaction index position.


##### Parameters

1. `QUANTITY|TAG` - a block number, or the string `"earliest"`, `"latest"` or `"pending"`, as in the [default block parameter](#the-default-block-parameter).
2. `QUANTITY` - the transaction index position.

##### Example Parameters
```js
params: [
   '0x29c', // 668
   '0x0' // 0
]
```

##### Returns

See [eth_getTransactionByHash](#eth_gettransactionbyhash)

##### Example
```js
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_getTransactionByBlockNumberAndIndex","params":["0x29c", "0x0"],"id":1}'
```

Result see [eth_getTransactionByHash](#eth_gettransactionbyhash)
*/
exports.eth_getTransactionByBlockNumberAndIndex = async ([_blockNum, _idx], ctx) => {
    const idx = index_js_1.hexToNumber(_idx);
    // strip leading 0x
    const blockNum = index_js_1.hexToNumber(_blockNum);
    const body = { num: blockNum };
    const { data: block } = await ctx.tronClient.post("/wallet/getblockbynum", body);
    if (!Object.keys(block).length) {
        throw new errors_js_1.ClientError(`Unknown block ${blockHash}`);
    }
    const tx = block.transactions[idx];
    return exports.eth_getTransactionByHash([`0x${tx.txID}`], ctx);
};
/*
#### eth_getTransactionReceipt

Returns the receipt of a transaction by transaction hash.

**Note** That the receipt is not available for pending transactions.


##### Parameters

1. `DATA`, 32 Bytes - hash of a transaction

##### Example Parameters
```js
params: [
   '0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238'
]
```

##### Returns

`Object` - A transaction receipt object, or `null` when no receipt was found:

  - `transactionHash `: `DATA`, 32 Bytes - hash of the transaction.
  - `transactionIndex`: `QUANTITY` - integer of the transaction's index position in the block.
  - `blockHash`: `DATA`, 32 Bytes - hash of the block where this transaction was in.
  - `blockNumber`: `QUANTITY` - block number where this transaction was in.
  - `from`: `DATA`, 20 Bytes - address of the sender.
  - `to`: `DATA`, 20 Bytes - address of the receiver. null when it's a contract creation transaction.
  - `cumulativeGasUsed `: `QUANTITY ` - The total amount of gas used when this transaction was executed in the block.
  - `gasUsed `: `QUANTITY ` - The amount of gas used by this specific transaction alone.
  - `contractAddress `: `DATA`, 20 Bytes - The contract address created, if the transaction was a contract creation, otherwise `null`.
  - `logs`: `Array` - Array of log objects, which this transaction generated.
  - `logsBloom`: `DATA`, 256 Bytes - Bloom filter for light clients to quickly retrieve related logs.

It also returns _either_ :

  - `root` : `DATA` 32 bytes of post-transaction stateroot (pre Byzantium)
  - `status`: `QUANTITY` either `1` (success) or `0` (failure)
*/
exports.eth_getTransactionReceipt = async ([txHash], ctx) => {
    // strip leading 0x
    let hash = txHash.substr(2);
    const body = {
        value: hash,
    };
    // console.log(body);
    const [{ data: txInfo }, { data: tx }] = await Promise.all([
        ctx.tronClient.post(`/wallet/gettransactioninfobyid`, body),
        ctx.tronClient.post(`/wallet/gettransactionbyid`, body),
    ]);
    if (!Object.keys(txInfo).length) {
        return null;
    }
    const { data: block } = await ctx.tronClient.post(`/wallet/getblockbynum`, {
        num: txInfo.blockNumber,
    });
    // TODO! search index in block.transactions
    const blockIndex = 0;
    const blockHash = `0x${block.blockID}`;
    // console.log({ tx, txInfo, block });
    return index_js_1.transactionReceipt.fromTron(tx, txInfo, blockHash, blockIndex);
};
exports.eth_pendingTransactions = async (_params, _ctx) => {
    // TODO: tron-java: i dont think there is a tx pool API for tron :(
    throw new MethodNotAvailableError("eth_pendingTransactions");
};
