import axios from "axios";

export function networkToTronApiUrl(network = "mainnet") {
  switch (network) {
    case "mainnet":
      return "https://api.trongrid.io";
    case "shasta":
      return "https://api.shasta.trongrid.io";
    case "nile":
      return "https://api.nileex.io";
    default:
      throw new Error(
        `Unknown Tron network "${network}", no API url mapping found`
      );
  }
}

// Events API
export function networkToTronEventsApiUrl(network = "mainnet") {
  //  https://github.com/tronprotocol/Documentation/blob/master/English_Documentation/TRON_Event_Subscribe/tron-eventquery.md
  switch (network) {
    case "mainnet":
      return "https://api.tronex.io";
    case "nile":
      return "https://event.nileex.io";
    // NOTE: could not find a known API server for shasta network...
    default:
      throw new Error(
        `Unknown Tron network "${network}", no events API url mapping found`
      );
  }
}

// TODO: refactor to use cross-fetch?
export function createClient(tronApiUrl = networkToTronApiUrl("mainnet")) {
  const client = axios.create({
    baseURL: tronApiUrl,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return client;
}

export default function createContext({
  network = "mainnet",
  tronApiUrl: tronApiUrl_ = null,
  tronEventsApiUrl: tronEventsApiUrl_ = null,
  config: config_ = {},
  privateKey = "",
  mapBytecode,
} = {}) {
  const tronApiUrl = tronApiUrl_ || networkToTronApiUrl(network);
  const tronClient = createClient(tronApiUrl);

  const tronEventsClient = (() => {
    // not supported by shasta, will fall back to slow method for fetching logs
    try {
      const tronEventsApiUrl =
        tronEventsApiUrl_ || networkToTronEventsApiUrl(network);
      return createClient(tronEventsApiUrl);
    } catch (err) {
      return null;
    }
  })();

  const config = {
    convertToWei: false,
    ...config_,
  };
  return { tronClient, tronEventsClient, config, privateKey, mapBytecode };
}
