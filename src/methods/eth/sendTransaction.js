import ethRpcErrors from "eth-rpc-errors";
import { address as ethAddress } from "../utils/index.js";
import Web3 from "web3";
import { signTransaction } from "../utils/tron-crypto.js";

const { hexToNumber } = Web3.utils;

const web3 = new Web3();

// 3000 TRX
const DEFAULT_FEE_LIMIT = 3_000_000_000;

const { ethErrors } = ethRpcErrors;

// TODO: replace with client side protobuf....
async function createTransaction({ from, to, amount }, ctx) {
  const { data } = await ctx.tronClient.post(`/wallet/createtransaction`, {
    to_address: ethAddress.toTronHex(to),
    owner_address: ethAddress.toTronHex(from),
    amount,
  });
  return data;
}

async function signAndBroadcast(tronTransaction, ctx) {
  const { privateKey, tronClient } = ctx;
  const signedTronTransaction = signTransaction(tronTransaction, privateKey);
  const { data } = await tronClient.post(
    "wallet/broadcasttransaction",
    signedTronTransaction
  );
  // console.dir({ signedTronTransaction, data }, { depth: null });
  // handle known errors
  if (data.code) {
    const javaTronMessage = Web3.utils.hexToAscii(`0x${data.message}`);
    const message = [
      data.code ? `${data.code}: ` : "",
      javaTronMessage,
      data.txid ? ` (txid: ${data.txid})` : "",
    ].join("");
    throw ethErrors.rpc.transactionRejected({ message, data });
  }
  return data;
}

/*
eth_sendTransaction
Creates new message call transaction or a contract creation, if the data field contains code.

Parameters
Object - The transaction object
from: DATA, 20 Bytes - The address the transaction is send from.
to: DATA, 20 Bytes - (optional when creating new contract) The address the transaction is directed to.
gas: QUANTITY - (optional, default: 90000) Integer of the gas provided for the transaction execution. It will return unused gas.
gasPrice: QUANTITY - (optional, default: To-Be-Determined) Integer of the gasPrice used for each paid gas
value: QUANTITY - (optional) Integer of the value sent with this transaction
data: DATA - The compiled code of a contract OR the hash of the invoked method signature and encoded parameters. For details see Ethereum Contract ABI
nonce: QUANTITY - (optional) Integer of a nonce. This allows to overwrite your own pending transactions that use the same nonce.

Example:
params: [{
  "from": "0xb60e8dd61c5d32be8058bb8eb970870f07233155",
  "to": "0xd46e8dd67c5d32be8058bb8eb970870f07244567",
  "gas": "0x76c0", // 30400
  "gasPrice": "0x9184e72a000", // 10000000000000
  "value": "0x9184e72a", // 2441406250
  "data": "0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675"
}]

Returns
DATA, 32 Bytes - the transaction hash, or the zero hash if the transaction is not yet available.

Use eth_getTransactionReceipt to get the contract address, after the transaction was mined, when you created a contract.
*/
export const eth_sendTransaction = async ([txInput = {}], ctx) => {
  if (!ctx.privateKey) {
    throw ethErrors.rpc.methodNotSupported({
      message: `eth_sendTransaction is not suppoerted (privateKey not passed to java-tron-provider)`,
    });
  }

  const { from } = txInput;
  const { privateKey } = ctx;

  const account = web3.eth.accounts.privateKeyToAccount(privateKey);
  const address = account.address;

  // TODO: find proper error to throw...
  if (address.toLowerCase() !== from.toLowerCase()) {
    throw ethErrors.provider.unauthorized(
      `expected "from" param to be ${address} but received ${from}`
    );
  }

  if ("value" in txInput) {
    return sendTransferTransaction(txInput, ctx);
  }
  if ("data" in txInput) {
    if (!txInput.to) {
      return sendCreateSmartContractTransaction(txInput, ctx);
    }
    return sendTriggerSmartContractTransaction(txInput, ctx);
  }

  throw ethErrors.rpc.invalidInput(`missing data or value property`);
};

async function sendTransferTransaction(txInput = {}, ctx) {
  const { from, to } = txInput;

  const amount = hexToNumber(txInput.value);
  if (!(amount > 0)) {
    throw ethErrors.rpc.invalidInput("value must be greater than 0");
  }

  // TODO: create the hex to sign client side instead of trusting server...

  // https://github.com/andelf/tron-examples/blob/master/js-demo/src/main.js

  // const address = ethAddress.toTron(account);
  const tronTx = await signAndBroadcast(
    await createTransaction({ from, to, amount }, ctx),
    ctx
  );
  return `0x${tronTx.txid}`;
}

async function mapBytecode(bytecode, ctx) {
  const defaultMetadata = {
    name: "DeployedByJavaTronProvider",
  };

  if (ctx.mapBytecode) {
    // strip leading 0x and lowercase
    const normalizedBytecode = `0x${bytecode.toLowerCase()}`;
    const res = await ctx.mapBytecode(normalizedBytecode);
    if (!res) return defaultMetadata;
    return {
      ...defaultMetadata,
      ...res,
    };
  }
  return defaultMetadata;
}

async function sendCreateSmartContractTransaction(txInput = {}, ctx) {
  // strip leading 0x
  const bytecode = txInput.data.substr(2);

  const metadata = await mapBytecode(bytecode, ctx);

  const body = {
    // TODO: convert abi to old style?
    // TODO: how do we actually get the ABI... it's not passed to the provider normally...
    // abi: "",
    bytecode,
    owner_address: ethAddress.toTronHex(txInput.from),
    // TODO: dont hardcode.. use gasLimit for that value?
    origin_energy_limit: DEFAULT_FEE_LIMIT,
    // TODO: dont hardcode.. use gasLimit for that value?
    fee_limit: DEFAULT_FEE_LIMIT,
    call_value: txInput.value,
    name: metadata.name,
    abi: metadata.abi ? JSON.stringify(metadata.abi) : null,
  };
  if (!body.abi) delete body.abi;
  const { data: unsignedTronTx } = await ctx.tronClient.post(
    `/wallet/deploycontract`,
    body
  );
  if (unsignedTronTx.Error) {
    throw ethErrors.rpc.transactionRejected({
      message: unsignedTronTx.Error,
      data: {
        request: body,
        response: unsignedTronTx,
      },
    });
  }
  // console.dir({ unsignedTronTx }, { depth: null });
  const tronTx = await signAndBroadcast(unsignedTronTx, ctx);
  // console.dir({ tronTx }, { depth: null });

  return `0x${tronTx.txid}`;
}

async function sendTriggerSmartContractTransaction(txInput = {}, ctx) {
  // trigger smart contract...
  // TODO: refactor: reduce code duplication with eth_call?

  const body = {
    visible: false,
    contract_address: ethAddress.toTronHex(txInput.to),
    owner_address: ethAddress.toTronHex(txInput.from),
    data: txInput.data.substr(2), // strip leading 0x
    // TODO: dont hardcode.. use gasLimit for that value?
    fee_limit: DEFAULT_FEE_LIMIT,
  };
  const {
    data: { transaction: unsignedTronTx },
  } = await ctx.tronClient.post(`/wallet/triggersmartcontract`, body);

  // console.dir({ unsignedTronTx }, { depth: null });
  const tronTx = await signAndBroadcast(unsignedTronTx, ctx);
  // console.dir({ tronTx }, { depth: null });

  return `0x${tronTx.txid}`;
}
