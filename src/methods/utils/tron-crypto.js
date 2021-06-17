import elliptic from "elliptic";

const ec = new elliptic.ec("secp256k1");

function signature2hex(signature) {
  const r = signature.r;
  const s = signature.s;
  const id = signature.recoveryParam;
  let rHex = r.toString("hex");

  while (rHex.length < 64) {
    rHex = `0${rHex}`;
  }

  let sHex = s.toString("hex");

  while (sHex.length < 64) {
    sHex = `0${sHex}`;
  }

  let idHex = id.toString(16);
  while (idHex.length < 2) {
    idHex = `0${idHex}`;
  }

  const signHex = `${rHex}${sHex}${idHex}`;

  return signHex;
}

export function signBytes(hexStr, privateKey) {
  const key = ec.keyFromPrivate(privateKey, "hex");
  const signature = key.sign(hexStr);
  return signature2hex(signature);
}

export function signTransaction(transaction, privateKey) {
  /*
  TODO
  if (address !== transaction.raw_data.contract[0].parameter.value.owner_address.toLowerCase())
                    return callback('Private key does not match address in transaction');
  */
  const txID = transaction.txID;
  const sig = signBytes(txID, privateKey);

  // TODO: ensure signature not already there?
  return {
    ...transaction,
    signature: [...(transaction.signature || []), sig],
  };
}
