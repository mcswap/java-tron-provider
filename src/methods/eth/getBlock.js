// import web3lib from "web3";
// import { notImplemented } from "./utils.js";
import { hexToNumber, block } from "../utils/index.js";
import { ClientError } from "../../errors.js";
export { eth_getTransactionByHash } from "./getTransaction.js";

// handles both variations (by number and by hash)
export const eth_getBlock_ = (byNumber = false) => async (
  [arg1, fullTransactions],
  ctx
) => {
  // console.log([arg1, fullTransactions]);
  // strip leading "0x"
  let body;
  let url;
  let blockIdStr;
  if (byNumber) {
    if (arg1 === "latest") {
      url = "/wallet/getnowblock";
      body = {};
      blockIdStr = "latest";
    } else {
      const num = hexToNumber(arg1);
      body = { num };
      url = "/wallet/getblockbynum";
      blockIdStr = num;
    }
  } else {
    const hash = arg1.substr(2);
    body = { value: hash };
    url = "/wallet/getblockbyid";
    blockIdStr = arg1;
  }
  const { data } = await ctx.tronClient.post(url, body);
  // console.dir(data, { depth: null });

  if (!Object.keys(data).length) {
    throw new ClientError(`Unknown block ${blockIdStr}`);
  }

  // Tron omits the transations property when there are no transactions...
  if (!data.transactions) {
    data.transactions = [];
  }

  // console.dir({ data }, { depth: null });
  let ethBlock = block.fromTron(data);

  // filter out transactions with negative values for thegraph compatibility?
  // had a tx with negative value in privatenet genesis block...
  ethBlock.transactions = ethBlock.transactions.filter(
    (tx) => tx.value[0] !== "-"
  );

  if (!fullTransactions) {
    ethBlock = {
      ...ethBlock,
      transactions: ethBlock.transactions.map((tx) => tx.hash),
    };
  }

  // console.dir({ ethBlock }, { depth: null });
  return ethBlock;
};

/*
#### eth_getBlockByHash

Returns information about a block by hash.


##### Parameters

1. `DATA`, 32 Bytes - Hash of a block.
2. `Boolean` - If `true` it returns the full transaction objects, if `false` only the hashes of the transactions.

##### Example Parameters
```js
params: [
   '0xe670ec64341771606e55d6b4ca35a1a6b75ee3d5145a99d05921026d1527331',
   true
]
```

##### Returns

`Object` - A block object, or `null` when no block was found:

  - `number`: `QUANTITY` - the block number. `null` when its pending block.
  - `hash`: `DATA`, 32 Bytes - hash of the block. `null` when its pending block.
  - `parentHash`: `DATA`, 32 Bytes - hash of the parent block.
  - `nonce`: `DATA`, 8 Bytes - hash of the generated proof-of-work. `null` when its pending block.
  - `sha3Uncles`: `DATA`, 32 Bytes - SHA3 of the uncles data in the block.
  - `logsBloom`: `DATA`, 256 Bytes - the bloom filter for the logs of the block. `null` when its pending block.
  - `transactionsRoot`: `DATA`, 32 Bytes - the root of the transaction trie of the block.
  - `stateRoot`: `DATA`, 32 Bytes - the root of the final state trie of the block.
  - `receiptsRoot`: `DATA`, 32 Bytes - the root of the receipts trie of the block.
  - `miner`: `DATA`, 20 Bytes - the address of the beneficiary to whom the mining rewards were given.
  - `difficulty`: `QUANTITY` - integer of the difficulty for this block.
  - `totalDifficulty`: `QUANTITY` - integer of the total difficulty of the chain until this block.
  - `extraData`: `DATA` - the "extra data" field of this block.
  - `size`: `QUANTITY` - integer the size of this block in bytes.
  - `gasLimit`: `QUANTITY` - the maximum gas allowed in this block.
  - `gasUsed`: `QUANTITY` - the total used gas by all transactions in this block.
  - `timestamp`: `QUANTITY` - the unix timestamp for when the block was collated.
  - `transactions`: `Array` - Array of transaction objects, or 32 Bytes transaction hashes depending on the last given parameter.
  - `uncles`: `Array` - Array of uncle hashes.
*/
export const eth_getBlockByHash = eth_getBlock_(false);

/*
 #### eth_getBlockByNumber

Returns information about a block by block number.

##### Parameters

1. `QUANTITY|TAG` - integer of a block number, or the string `"earliest"`, `"latest"` or `"pending"`, as in the [default block parameter](#the-default-block-parameter).
2. `Boolean` - If `true` it returns the full transaction objects, if `false` only the hashes of the transactions.

##### Example Parameters
```js
params: [
   '0x1b4', // 436
   true
]
```

##### Returns

See [eth_getBlockByHash](#eth_getblockbyhash)
*/
export const eth_getBlockByNumber = eth_getBlock_(true);
