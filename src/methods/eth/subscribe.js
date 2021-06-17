// TODO: implement eth_subscribe... simulate via polling or use tron's subscribe API?
import ethRpcErrors from "eth-rpc-errors";

const { ethErrors } = ethRpcErrors;

export const eth_subscribe = async (params, ctx) => {
  throw ethErrors.rpc.methodNotSupported({
    message: `eth_subscribe is not supported`,
  });

  // throw ethErrors.rpc.invalidInput(`missing data or value property`);
};
