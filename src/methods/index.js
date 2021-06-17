import * as web3 from "./web3.js";
import * as net from "./net.js";
import * as eth from "./eth/index.js";

const allMethods = { ...web3, ...net, ...eth };

export default allMethods;
