export * from "./getTransaction.js";
import ethRpcErrors from "eth-rpc-errors";

const { ethErrors } = ethRpcErrors;

/**
 * eth_sendRawTransaction
 * Creates new message call transaction or a contract creation for signed transactions.
 *
 * Parameters
 * DATA, The signed transaction data.
 *
 * Example Parameters
 * params: ["0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675"]
 *
 * Returns
 * DATA, 32 Bytes - the transaction hash, or the zero hash if the transaction is not yet available.
 *
 * Use eth_getTransactionReceipt to get the contract address, after the transaction was mined, when you created a contract.
 */
/*
Ethereum transfer transaction data example:

https://www.ethereumdecoder.com/?search=0xf86d808507aef40a00825208941286df686b80bd49e20f0bb54671bd99b61b999389f087be97c4383400008029a00a51cc99ca94f33930813729137e3300ce6a7d201fe5f43c1c2e385a25ef1ef4a03345cca28a8b9ca250a33945aff2063117156ab368a82af1a5190e817f62d7d9


Tron transfer example:

POST /wallet/createtransaction
{
  amount: 100000000
  owner_address: "411286df686b80bd49e20f0bb54671bd99b61b9993"
  to_address: "41b4eda9945aed0fb120533663fcad56407033f6c6"
}

Returns:

{
    visible: false,
    txID: "7de68786b81c8d022401b184101d8c6b8c18e264b13b4a5d3d476877df562a67",
    raw_data: {
      contract: [
        {
          parameter: {
            value: {
              amount: 100000000,
              owner_address: "411286df686b80bd49e20f0bb54671bd99b61b9993",
              to_address: "41b4eda9945aed0fb120533663fcad56407033f6c6",
            },
            type_url: "type.googleapis.com/protocol.TransferContract",
          },
          type: "TransferContract",
        },
      ],
      ref_block_bytes: "c071",
      ref_block_hash: "54020c6d9c1363e6",
      expiration: 1592262207000,
      timestamp: 1592262149871,
    },
    raw_data_hex:
      "0a02c071220854020c6d9c1363e64098cce4d1ab2e5a68080112640a2d747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e5472616e73666572436f6e747261637412330a15411286df686b80bd49e20f0bb54671bd99b61b9993121541b4eda9945aed0fb120533663fcad56407033f6c61880c2d72f70ef8de1d1ab2e",
}

TODO: serialization/signature mechanism significantly different. This needs to be fixed client side.
*/
export const eth_sendRawTransaction = async ([txData], ctx) => {
  // const address = ethAddress.toTron(account);
  const { data } = await ctx.tronClient.post(`/wallet/broadcasthex`, {
    // strip leading "0x"
    transaction: txData.substr(2),
  });
  if (data.Error) {
    console.warn(
      "eth_sendRawTransaction is partially implemented, it calls /wallet/broadcasthex directly which means it will fail if it is passed an Ethereum transaction"
    );
    throw ethErrors.rpc.transactionRejected({ message: data.Error, data });
  }
  return data.txid;
};
