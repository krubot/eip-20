require("dotenv").config();

const { ethers, network } = require("hardhat");

async function deploy(deployArgs) {
  const accounts = await ethers.getSigners();

  const networkName = network.name.toUpperCase()

  const abiCoder = new ethers.utils.AbiCoder();

  const salt = ethers.utils.hexZeroPad(ethers.utils.hexlify(0),32);

  console.log("Deploying contracts with the account: ", accounts[0].address);

  console.log("Account balance: ", (await accounts[0].getBalance()).toString());

  const Factory = await ethers.getContractFactory("Factory");

  var factory = await Factory.attach(process.env[networkName + '_FACTORY_CONTRACT']);

  console.log("Factory contract has already been deployed at: ", process.env[networkName + '_FACTORY_CONTRACT']);

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

  if ((await ethers.provider.getCode(deploymentAddress)) == "0x") {
    var codeDeploy = await factory.deploy(
      ethers.utils.hexConcat([
        EIP20.bytecode,
        abiCoder.encode(["address"],[process.env[networkName + '_FACTORY_CONTRACT']]),
      ]),
      salt
    );

    console.log("Deployment of EIP20 contract from factory transaction: ",codeDeploy.hash);

    await codeDeploy.wait();

    console.log("Deployment of EIP20 contract from factory is complete");
  } else {
    console.log("Deployment of EIP20 contract from factory has already been deployed");
  }

  if ((await ethers.provider.getCode(proxyAddress)) == "0x") {
    var codeDeploy = await factory.deploy(
      ethers.utils.hexConcat([
        Proxy.bytecode,
        abiCoder.encode(["address"],[process.env[networkName + '_FACTORY_CONTRACT']]),
      ]),
      salt
    );

    console.log("Deployment of Proxy contract from factory transaction: ",codeDeploy.hash);

    await codeDeploy.wait();

    console.log("Deployment of Proxy contract from factory is complete");
  } else {
    console.log("Deployment of Proxy contract from factory has already been deployed");
  }
}

deploy().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
