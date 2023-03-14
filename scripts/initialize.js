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

    var initializeEIP20 = await factory.delegateCall(
      deploymentAddress,
      calldata(
        [
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "owner_",
                "type": "address"
              }
            ],
            "name": "initialize",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          }
        ],
        "initialize(address)",
        [
          proxyAddress,
        ]
      )
    )

    console.log("Initialization of EIP20 contract from factory transaction: ",initializeEIP20.hash);

    await initializeEIP20.wait();

    console.log("Initialization of EIP20 contract from factory is complete");

    var initializeProxy = await factory.delegateCall(
      proxyAddress,
      calldata(
        [
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "addr",
                "type": "address"
              }
            ],
            "name": "initialize",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          }
        ],
        "initialize(address)",
        [
          process.env[networkName + '_FACTORY_CONTRACT'],
        ]
      )
    )

    console.log("Initialization of Proxy contract from factory transaction: ",initializeProxy.hash);

    await initializeProxy.wait();

    console.log("Initialization of Proxy contract from factory is complete");
  } else {
    console.log("Factory contract does not exist, deploy this first before running this script");
  }
}

deploy().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
