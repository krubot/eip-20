require("dotenv").config();

const { ethers, network } = require("hardhat");

function calldata(implementationABI,implementationInitialize,implementationArgs) {
  const signer = new ethers.Wallet(JSON.parse(process.env.PRIVATE_KEYS)[0]);

  const implementation = new ethers.utils.Interface(implementationABI);

  const calldata = implementation.encodeFunctionData(implementationInitialize,implementationArgs);

  return calldata
}

async function deploy() {
  const accounts = await ethers.getSigners();

  const networkName = network.name.toUpperCase();

  const abiCoder = new ethers.utils.AbiCoder();

  const salt = ethers.utils.hexZeroPad(ethers.utils.hexlify(0),32);

  console.log("Deploying contracts with the account: ", accounts[0].address);

  console.log("Account balance: ", (await accounts[0].getBalance()).toString());

  const Factory = await ethers.getContractFactory("Factory");

  var factory = await Factory.attach(process.env[networkName + '_FACTORY_CONTRACT']);

  if (process.env[networkName + "_FACTORY_CONTRACT"] != null) {
    const EIP20 = await ethers.getContractFactory("EIP20");

    var deploymentAddress = await factory.getAddress(
      ethers.utils.hexConcat([
        EIP20.bytecode,
        abiCoder.encode(["address"],[process.env[networkName + '_FACTORY_CONTRACT']]),
      ]),
      salt
    );

    console.log("Deployment address of EIP20 contract from factory is: ",deploymentAddress);

    const Proxy = await ethers.getContractFactory("Proxy");

    var proxyAddress = await factory.getAddress(
      ethers.utils.hexConcat([
        Proxy.bytecode,
        abiCoder.encode(["address"],[process.env[networkName + '_FACTORY_CONTRACT']]),
      ]),
      salt
    );

    console.log("Deployment address of Proxy contract from factory is: ",proxyAddress);

    var configure = await factory.delegateCall(
      proxyAddress,
      calldata(
        [
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "addr",
                "type": "address"
              },
              {
                "internalType": "bytes",
                "name": "data",
                "type": "bytes"
              }
            ],
            "name": "configure",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          }
        ],
        "configure(address,bytes)",
        [
          deploymentAddress,
          calldata(
            [
              {
                "inputs": [
                  {
                    "internalType": "string",
                    "name": "name_",
                    "type": "string"
                  },
                  {
                    "internalType": "string",
                    "name": "symbol_",
                    "type": "string"
                  },
                  {
                    "components": [
                      {
                        "internalType": "address",
                        "name": "airdropAddress",
                        "type": "address"
                      },
                      {
                        "internalType": "uint256",
                        "name": "airdropAmount",
                        "type": "uint256"
                      }
                    ],
                    "internalType": "struct EIP20.airdrop[]",
                    "name": "airdrop_",
                    "type": "tuple[]"
                  }
                ],
                "name": "configure",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
              }
            ],
            "configure(string,string,(address,uint256)[])",
            [
              "MyToken",
              "HIX",
              [
                {
                  "airdropAddress": "0xA7b192eBA8E0B07e2D25c632986fA4cB2666bB9f",
                  "airdropAmount": "1000000000000000000"
                }
              ]
            ]
          )
        ]
      )
    )

    console.log("Configuration of contracts from factory transaction: ",configure.hash);

    await configure.wait();

    console.log("Configuration of contracts from factory is complete");
  } else {
    console.log("Factory contract does not exist, deploy this first before running this script");
  }
}

deploy().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
