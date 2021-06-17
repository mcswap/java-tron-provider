import test from "ava";
import Web3 from "web3";
import createJavaTronProvider from "../src/index.js";
import { testAccounts } from "./_common.js";
import solc from "solc";

test("web3.eth.getBlock(0)", async (t) => {
  const provider = createJavaTronProvider({ network: "shasta" });
  const web3 = new Web3(provider);

  // TODO!
  // const res = await web3.eth.getCoinbase();
  const genesisBlock = await web3.eth.getBlock(0);
  t.deepEqual(genesisBlock, {
    difficulty: "163591",
    extraData:
      "0x0000000000000000000000000000000000000000000000000000000000000000",
    gasLimit: 12500000,
    gasUsed: 1000000,
    hash: "0x0000000000000000de1aa88295e1fcf982742f773e0419c5a9c134c994a9059e",
    logsBloom: null,
    miner: "0x4E65FDa2159562a496F9f3522f89122A3088497a",
    nonce: "0x0000000000000000",
    number: 0,
    parentHash:
      "0x957dc2d350daecc7bb6a38f3938ebde0a0c1cedafe15f0edae4256a2907449f6",
    receiptsRoot:
      "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
    sha3Uncles:
      "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
    size: 163591,
    stateRoot:
      "0xd5855eb08b3387c0af375e9cdb6acfc05eb8f519e419b874b6ff2ffda7ed1dff",
    timestamp: 1424182926,
    totalDifficulty: "163591",
    transactions: [
      "0xabda6c8b1e8954dbe1d5a06a774a3e6923b003d29bb4ce286998f23452e3b04a",
      "0x0acc95174d7f3cc9c976645724469588307686dca970ded13d452172563c0a1a",
      "0x55a72b3e54ddd6a51cb7a2f812d5acc99b7f94019065aab208becfa4d606db8a",
      "0x0d15008a9d927e73c3ec2467848cdcc7bca685a6b83ed6edcb8600209b855c01",
      "0x2a93f241482b7447b6dd0e74f2e501494f82f2d2a8e07a73a19c8310dc3b7cfb",
      "0xe17063a115020a436843c8aed771e1aaf7b44a488f59fb00357b373b9c74f54a",
      "0x04a293a589ddc1821cf004242cf8c32509d0ddb4797bba38cfcaf5d9afb2c54d",
      "0x857b7ebb0d8fff65353254c687be6dac34c2eff229d41b912b6756ad052c48a3",
      "0x15f9b8fc8fc1517dd71bf92d2835641c9df1ba517696d81fea8bd3a373e2c8ab",
      "0x22456ddb597ababb9ae33d5d105e6fc20ae7b63bdbda18f3065352bc47f6317d",
    ],
    transactionsRoot:
      "0x0000000000000000000000000000000000000000000000000000000000000000",
    uncles: [],
  });
});

test("web3.eth.getAccounts (no private key)", async (t) => {
  const provider = createJavaTronProvider({ network: "shasta" });
  const web3 = new Web3(provider);
  const response = await web3.eth.getAccounts();
  t.deepEqual(response, []);
});

test("web3.eth.getAccounts (with private key)", async (t) => {
  const privateKey =
    "ad6722ca3e7349869d4d60a24363b40421570b80025e4edb7ff9864818717586";
  const provider = createJavaTronProvider({ network: "shasta", privateKey });
  const web3 = new Web3(provider);
  const response = await web3.eth.getAccounts();
  t.deepEqual(response, ["0xE2008D7dF11661b774c0ae6B85972D4CdF711941"]);
});

// private key that corresponds to testAccounts[0]
const testAccount0PrivateKey =
  "52087001767e9c30288232baa07d3ac5cf0e3c8de30a49b98424ccf9b92e2dfd";

test("web3.eth.sendTransaction (<=0 amount throws)", async (t) => {
  const provider = createJavaTronProvider({
    network: "shasta",
    privateKey: testAccount0PrivateKey,
  });
  const web3 = new Web3(provider);

  const from = testAccounts[0];
  const to = testAccounts[1];
  await t.throwsAsync(
    async () => {
      await web3.eth.sendTransaction({
        from,
        to,
        value: "0",
      });
    },
    { message: "value must be greater than 0" }
  );
  await t.throwsAsync(
    async () => {
      await web3.eth.sendTransaction({
        from,
        to,
        value: "-2",
      });
    },
    { message: "value must be greater than 0" }
  );
});

// TODO: WIP
test("web3.eth.sendTransaction", async (t) => {
  const provider = createJavaTronProvider({
    network: "nile",
    // private key that corresponds to testAccounts[0]
    privateKey: testAccount0PrivateKey,
  });
  const web3 = new Web3(provider);

  const from = testAccounts[0];
  const to = testAccounts[1];
  const response = await web3.eth.sendTransaction({
    from,
    to,
    // 0.01 TRX
    value: Web3.utils.numberToHex(10000),
  });

  t.like(response, {
    from: "0x039e63f8d70becdaba64a45091688a8446d57689",
    to: "0x1286df686b80bd49e20f0bb54671bd99b61b9993",
    value: Web3.utils.numberToHex(10000),
  });
});

// Needed by truffle... :/
test.todo("eth_getStorageAt");

const simplestoreAbi = [
  {
    constant: true,
    inputs: [],
    name: "get",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ internalType: "uint256", name: "_value", type: "uint256" }],
    name: "set",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
];

const simpleStoreBytecode =
  "0x608060405234801561001057600080fd5b5060c68061001f6000396000f3fe6080604052348015600f57600080fd5b506004361060325760003560e01c806360fe47b11460375780636d4ce63c146062575b600080fd5b606060048036036020811015604b57600080fd5b8101908080359060200190929190505050607e565b005b60686088565b6040518082815260200191505060405180910390f35b8060008190555050565b6000805490509056fea265627a7a72315820ab0f8ae4170b26c579263575a2509b3aaa27f5b4963c99a56a5405510ed958e864736f6c63430005110032";

test("eth_sendTransaction deploy contract", async (t) => {
  // https://gist.github.com/kevholder/b888c0d59bd693c223a4f0f22ddf7650
  const provider = createJavaTronProvider({
    network: "shasta",
    // private key that corresponds to testAccounts[0]
    privateKey: testAccount0PrivateKey,
  });
  const web3 = new Web3(provider);

  const simplestoreContract = new web3.eth.Contract(simplestoreAbi);
  const from = testAccounts[0];
  const contractPromiEvent = simplestoreContract
    .deploy({
      data: simpleStoreBytecode,
      // gas: "4700000",
    })
    .send({ from });

  const contract = await contractPromiEvent;
  t.is(typeof contract.methods.get, "function");
  t.is(typeof contract.methods.set, "function");
  t.true(Web3.utils.isAddress(contract.options.address));
});

test("eth_sendTransaction deploy contract with ABI and name", async (t) => {
  // https://gist.github.com/kevholder/b888c0d59bd693c223a4f0f22ddf7650
  const provider = createJavaTronProvider({
    network: "nile",
    privateKey: testAccount0PrivateKey,
    mapBytecode: (bytecode) => {
      if (bytecode === simpleStoreBytecode) {
        return {
          name: "MappedName",
          abi: simplestoreAbi,
        };
      }
    },
  });
  const web3 = new Web3(provider);

  const simplestoreContract = new web3.eth.Contract(simplestoreAbi);
  const from = testAccounts[0];
  const contractPromiEvent = simplestoreContract
    .deploy({
      data: simpleStoreBytecode,
    })
    .send({ from });

  const contract = await contractPromiEvent;
  t.is(typeof contract.methods.get, "function");
  t.is(typeof contract.methods.set, "function");
  t.true(Web3.utils.isAddress(contract.options.address));
});

test("eth_sendTransaction events (nile)", async (t) => {
  t.plan(4);
  // https://gist.github.com/kevholder/b888c0d59bd693c223a4f0f22ddf7650
  const provider = createJavaTronProvider({
    network: "nile",
    // private key that corresponds to testAccounts[0]
    privateKey: testAccount0PrivateKey,
  });
  const web3 = new Web3(provider);

  const simplestoreContract = new web3.eth.Contract([]);
  const from = testAccounts[0];
  const promiEvent = simplestoreContract
    .deploy({
      data:
        "0x608060405234801561001057600080fd5b5060c68061001f6000396000f3fe6080604052348015600f57600080fd5b506004361060325760003560e01c806360fe47b11460375780636d4ce63c146062575b600080fd5b606060048036036020811015604b57600080fd5b8101908080359060200190929190505050607e565b005b60686088565b6040518082815260200191505060405180910390f35b8060008190555050565b6000805490509056fea265627a7a72315820ab0f8ae4170b26c579263575a2509b3aaa27f5b4963c99a56a5405510ed958e864736f6c634300050e0032",
      // gas: "4700000",
    })
    .send({ from });

  promiEvent.on("transactionHash", (transactionHash) => {
    t.true(Web3.utils.isHexStrict(transactionHash));
    t.is(transactionHash.length, 64 + 2);
  });
  promiEvent.on("receipt", (receipt) => {
    t.true(Web3.utils.isAddress(receipt.contractAddress));
  });
  const contract = await promiEvent;
  t.is(typeof contract, "object");
  // console.dir(contract, { depth: null });
  // address: 0x04Ef940F14dD063C701B7dc34519c0b50cE43250
  // address: 0xDc8ABBcFda94FE3936E05ac298D0FA815d3F4dD5
  // address: 0xE835aa0eC170f0ea02FA29a27896948eA19Af253
});

test("trigger constant smart contract", async (t) => {
  // https://gist.github.com/kevholder/b888c0d59bd693c223a4f0f22ddf7650
  const provider = createJavaTronProvider({
    network: "nile",
    // tronApiUrl: "http://localhost:8090",
    privateKey: testAccount0PrivateKey,
  });
  const web3 = new Web3(provider);

  const simplestoreContract = new web3.eth.Contract(
    simplestoreAbi,
    "0xDc8ABBcFda94FE3936E05ac298D0FA815d3F4dD5"
  );
  const from = testAccounts[0];

  const res = await simplestoreContract.methods.get().call({ from });
  t.is(res, "0");
});

test("trigger smart contract", async (t) => {
  // https://gist.github.com/kevholder/b888c0d59bd693c223a4f0f22ddf7650
  const provider = createJavaTronProvider({
    network: "nile",
    // tronApiUrl: "http://localhost:8090",
    privateKey: testAccount0PrivateKey,
  });
  const web3 = new Web3(provider);

  const simplestoreContract = new web3.eth.Contract(
    simplestoreAbi,
    "0x41f6819f1a208db12f66d11ccdf5c2babe8896b4"
  );
  const from = testAccounts[0];

  const receipt = await simplestoreContract.methods.set("1337").send({ from });
  t.like(receipt, { status: true });
  const res = await simplestoreContract.methods.get().call({ from });
  t.is(res, "1337");
});

test("getBalance (non existing account)", async (t) => {
  const provider = createJavaTronProvider({
    network: "nile",
    privateKey: testAccount0PrivateKey,
  });
  const web3 = new Web3(provider);

  const balance = await web3.eth.getBalance(
    "0x151e214d1396dd88400e68fa6911602f2339193b"
  );
  t.is(balance, "0");
});

test("getBalance (contract)", async (t) => {
  const provider = createJavaTronProvider({
    network: "nile",
    privateKey: testAccount0PrivateKey,
  });
  const web3 = new Web3(provider);

  // zero balance
  const emptyBalance = await web3.eth.getBalance(
    "0x3760187a9AEd3731B14ECB0C6294bFCca7f0647b"
  );
  t.is(emptyBalance, "0");
  //
  // some balance
  const balance = await web3.eth.getBalance(
    "0x5ea3d9252d485b10ddf05f04d988f6069884ce94"
  );
  t.is(balance, "1000000");
});
