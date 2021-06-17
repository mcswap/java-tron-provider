// import SafeEventEmitter from "safe-event-emitter";
import createDebug from "debug";

const debugError = createDebug("java-tron-provider:error");

/*
https://github.com/ethereum/web3.js/blob/v1.2.1/packages/web3-core-method/src/index.js#L412

Web3 v1.2.1 (which truffle uses) inspects the provider and if it has `.on`
function, it automatically assumes it supports pubsub requests (e.g.
eth_subscribe) and doesn't gracefully fall back to polling when it doesn't.
this seems to be fixed in later version of web3 (e.g. v1.2.11) but since
truffle uses web3 v1.2.1 and we haven't implemented eth_subscribe yet, we just
don't return an event emitter to avoid errors.
*/
export default function providerFromEngine(engine) {
  // const provider = new SafeEventEmitter();
  const provider = {};

  // DEPRECATED
  provider.sendAsync = engine.handle.bind(engine);
  // DEPRECATED
  provider.send = (req, callback) => {
    if (!callback)
      throw new Error('Web3 Provider - must provide callback to "send" method');
    engine.handle(req, callback);
  };

  // https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1193.md
  // Conforms to EIP 1193 API
  provider.request = async ({ method, params }) => {
    const res = await engine.handle({ method, params });
    // console.log({ res });
    if (res.error) {
      debugError(res.error);
      const { code, message, data } = res.error;
      const err = new Error(message);
      err.code = code;
      err.data = data;
      throw err;
    }
    return res.result;
  };

  // forward notifications
  /*
  if (engine.on) {
    engine.on("notification", (message) => {
      provider.emit("data", null, message);
    });
  }
  */
  return provider;
}
