import { address as ethAddress, numberToHex } from "./index.js";

// Utils to convert from/to eth/tron transaction object formats

// Tron has 2 formats in API calls: tx adn txInfo, both are needed to convert to ethereum format

// TODO: java-tron: add blockHash to get_transaction_info_by_id api call

function extractFromAddress(parameter) {
  if (parameter.value) {
    const v = parameter.value;
    if (v.owner_address) {
      return ethAddress.fromTronHex(v.owner_address);
    }
    if (v.transparent_from_address) {
      return ethAddress.fromTronHex(v.transparent_from_address);
    }
  }
  throw new Error(
    `could not extract "from" address ${JSON.stringify(parameter)}`
  );
}

function parseContract(tronTx) {
  const contract = tronTx.raw_data.contract[0];
  const parameter = contract.parameter;
  const type = contract.type;

  let toAddress;

  if (type === "CreateSmartContract") {
    toAddress = tronTx.contract_address;
  } else if (type === "TriggerSmartContract") {
    toAddress = parameter.value.contract_address;
  } else if (type === "FreezeBalanceContract") {
    /*
      Contract creation transaction should have {"to": null} (not {"to":"0x0"})
      e.g.:
      curl https://mainnet.infura.io/v3/ffebd74082564af3805d35947cb2e0c1 \
        -X POST \
        -H "Content-Type: application/json" \
        -d '{"jsonrpc":"2.0","method":"eth_getTransactionByHash","params": ["0x2f1c5c2b44f771e942a8506148e256f94f1a464babc938ae0690c6e34cd79190"],"id":1}' | jq
    */
    toAddress = null;
  } else {
    if (parameter.value.to_address) {
      toAddress = parameter.value.to_address;
    } else {
      // could not find toAddress, default to null address...
      toAddress = null;
    }
  }

  const from = extractFromAddress(parameter);
  const to = toAddress === null ? null : ethAddress.fromTronHex(toAddress);
  const value = numberToHex(
    parameter.value.amount || parameter.value.from_amount || 0
  );

  return { from, to, value };
}

// TODO: REFACTOR: each transaction type (as determined by contract type)
// should have a separate parse function (e.g. parseXContract()) with the
// common stuff factored in a parseCommon() function
export const fromTron = (tronTx, tronTxInfo, blockHash) => {
  // console.dir({ tronTx, tronTxInfo }, { depth: null });
  // TODO: tron has different types of transactions, need to handle them all
  // see spock-o
  // console.dir(tronTx.raw_data.contract, { depth: null });
  const blockNumber = numberToHex(tronTxInfo.blockNumber);

  // console.log(parameter.value);
  return {
    blockHash: blockHash,
    blockNumber: blockNumber, // 6139707
    hash: `0x${tronTx.txID}`,
    gas: numberToHex(tronTxInfo.fee || 0),

    // TODO: dummy data, didnt find good Tron equivalents yet
    // gas: "0xc350", // 50000
    gasPrice: numberToHex(20000000000),
    // TODO: this should be the tx data of tron transaction (e.g. tronTx.data)
    input: "0x",
    nonce: numberToHex(21), // 21
    v: "0x0",
    r: "0x0000000000000000000000000000000000000000000000000000000000000000",
    s: "0x0000000000000000000000000000000000000000000000000000000000000000",
    ...parseContract(tronTx),
  };
};
