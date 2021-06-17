import simulateGetLogs from "./simulateGetLogs.js";
import eventsApiGetLogs from "./eventsApiGetLogs.js";
import createDebug from "debug";

const debug = createDebug("java-tron-provider:warning");

export default async function eth_getLogs([filterObject], ctx) {
  if (ctx.tronEventsClient) {
    return eventsApiGetLogs([filterObject], ctx);
  }
  debug("unknown events API URL, eth_getLogs using slow method");
  return simulateGetLogs([filterObject], ctx);
}
