#!/usr/bin/env node
import { createJavaTronEngine } from "../src/index.js";

import express from "express";
import bodyParser from "body-parser";
// @idea use https://github.com/open-rpc/server-js?
// import config from "./config.js";
// import methods from "./methods/index.js";
import { networkToTronApiUrl } from "../src/methods/createContext.js";
import morgan from "morgan";
import w from "express-async-wrap";
import convict from "convict";

// Define a schema
const config = convict({
  env: {
    doc: "The application environment.",
    format: ["production", "development", "test"],
    default: "development",
    env: "NODE_ENV",
  },
  ip: {
    doc: "The IP address to bind.",
    format: String,
    default: "127.0.0.1",
    env: "IP_ADDRESS",
  },
  port: {
    doc: "The port to bind.",
    format: "port",
    default: 8333,
    env: "PORT",
    arg: "port",
  },
  tron: {
    network: {
      doc:
        "Tron network (used to set TRON_NODE value if latter is not specified).",
      format: String,
      default: "mainnet",
      env: "TRON_NETWORK",
    },
    apiUrl: {
      doc:
        "The IP/hostname of the Tron node. Changes based on TRON_NETWORK if not specified.",
      format: String,
      default: "",
      env: "TRON_NODE",
    },
  },
  verbose: {
    doc: "Verbose output",
    format: Boolean,
    default: false,
    arg: "verbose",
    env: "VERBOSE",
  },
  convertToWei: {
    doc:
      "Convert all SUN balances to WEI (can be useful for testing, e.g. Metamask wont display balance if it is too small)",
    format: Boolean,
    default: false,
    arg: "wei",
    env: "CONVERT_TO_WEI",
  },
});

const listenAsync = async (app, ip, port) =>
  new Promise((resolve, reject) => {
    const server = app.listen(port, ip, (err) => {
      if (err) return reject(err);
      resolve(server);
    });
  });

const getTronApiUrl = () => {
  return (
    config.get("tron.apiUrl") || networkToTronApiUrl(config.get("tron.network"))
  );
};

const createServer = () => {
  // Perform validation
  config.validate({ allowed: "strict" });

  const app = express();
  app.use(morgan("dev"));

  // parse even when content-type not set correctly
  app.use(bodyParser.json({ type: "*/*" }));

  if (config.get("verbose")) {
    app.use((req, res, next) => {
      console.log(req.body);
      next();
    });
  }

  const engine = createJavaTronEngine({
    network: config.get("tron.network"),
    tronApiUrl: getTronApiUrl(),
  });

  app.post(
    "/",
    w(async (req, res) => {
      const request = req.body;
      const response = await engine.handle(request);
      return res.json(response);
    })
  );

  // Error handler
  app.use((err, req, res, _next) => {
    /*
    if (err instanceof ClientError) {
      if (config.get("verbose")) {
        console.error(err);
      }
    }*/
    console.error(err);
    // res.status(status);
    // let id = null;
    /*
    try {
      id = req.body.id;
    } catch {}
    res.json({
      jsonrpc: JSON_RPC_VERSION,
      id,
      error: {
        code: err.code,
        message: err.message,
      },
    });
    */
    res.json(err);
  });

  const listen = async () => {
    const httpServer = await listenAsync(
      app,
      config.get("ip"),
      config.get("port")
    );
    return httpServer;
  };

  return { listen, config };
};

const handleError = (err) => {
  console.error(err);
  process.exit(1);
};

const run = async () => {
  const server = createServer();
  const httpServer = await server.listen();
  const { address, port } = httpServer.address();
  console.log(
    `Ethereum => Tron proxy server listening at http://${address}:${port}`
  );
  console.log(`Proxying requests to Tron node ${getTronApiUrl()}`);
};

run().catch(handleError);
