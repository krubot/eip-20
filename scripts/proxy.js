require("dotenv").config();

const { ethers, network } = require("hardhat");

function calldata(implementationABI,implementationInitialize,implementationArgs) {
  const implementation = new ethers.utils.Interface(implementationABI);

  const calldata = implementation.encodeFunctionData(implementationInitialize,implementationArgs);

  return calldata
}

async function deploy() {
  const accounts = await ethers.getSigners();

  const networkName = network.name.toUpperCase();

  const abiCoder = new ethers.utils.AbiCoder();

  var tokenSalt = ethers.utils.hexZeroPad(ethers.utils.hexlify(0),32);

  var proxySalt = ethers.utils.hexZeroPad(ethers.utils.hexlify(0),32);

  console.log("Deploying contracts with the account: ", accounts[0].address);

  console.log("Account balance: ", (await accounts[0].getBalance()).toString());

  const Factory = await ethers.getContractFactory("Factory");

  var factory = await Factory.attach(process.env[networkName + '_FACTORY_CONTRACT']);

  if (process.env[networkName + "_FACTORY_CONTRACT"] != null) {
    const Token = await ethers.getContractFactory("Token");

    const Proxy = await ethers.getContractFactory("TransparentProxy");

    var tokenAddress = await factory.getAddress(
      ethers.utils.hexConcat([
        Token.bytecode,
        abiCoder.encode(["address"],[process.env[networkName + '_FACTORY_CONTRACT']]),
      ]),
      tokenSalt
    );

    console.log("Deployment address of Token contract from factory is: ",tokenAddress);

    var configureCalldata = calldata(
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
              "internalType": "struct Token.airdrop[]",
              "name": "airdrop_",
              "type": "tuple[]"
            }
          ],
          "name": "initialize",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        }
      ],
      "initialize(string,string,(address,uint256)[])",
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
    );

    var proxyBytecode = ethers.utils.hexConcat([
      Proxy.bytecode,
      abiCoder.encode(["address","address","bytes"],[tokenAddress,process.env[networkName + '_FACTORY_CONTRACT'],configureCalldata]),
    ]);

    var proxyAddress = await factory.getAddress(proxyBytecode,proxySalt,{gasLimit: ethers.BigNumber.from(10000000)});

    console.log("Deployment address of Proxy Token contract from factory is: ",proxyAddress);

    if ((await ethers.provider.getCode(proxyAddress)) == "0x") {
      var codeDeploy = await factory.deploy(proxyBytecode,proxySalt,{gasLimit: ethers.BigNumber.from(10000000)});

      if (process.env.DEBUG_OUTPUT) {
        console.log("Deployment of Token Proxy bytecode: ",proxyBytecode);

        console.log("Deployment of Token Proxy salt: ",tokenSalt);
      }

      console.log("Deployment of Token Proxy contract from factory transaction: ",codeDeploy.hash);

      await codeDeploy.wait();

      console.log("Deployment of Token Proxy contract from factory is complete");
    } else {
      console.log("Deployment of Token Proxy contract from factory has already been deployed");
    }
  } else {
    console.log("Factory contract does not exist, deploy this first before running this script");
  }
}

deploy().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
