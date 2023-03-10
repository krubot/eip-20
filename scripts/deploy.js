require("dotenv").config();

const { writeFileSync } = require("fs");
const { ethers, artifacts, network } = require("hardhat");
const readlinePromises = require("readline");

const rl = readlinePromises.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true,
});

rl.question("Arguments file for deployment: ", (constructorArgsFile) => {
  var argModule = require(process.cwd() + "/" + constructorArgsFile);

  deploy(argModule).catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });

  rl.close();
});

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
      EIP20.bytecode
    ]),
    salt
  );

  console.log("Deployment address of EIP20 contract from factory is: ",deploymentAddress);

  const Proxy = await ethers.getContractFactory("Proxy");

  var proxyAddress = await factory.getAddress(
    ethers.utils.hexConcat([
      Proxy.bytecode,
      abiCoder.encode(["address","bytes"],deployArgs),
    ]),
    salt
  );

  console.log("Deployment address of Proxy contract from factory is: ",proxyAddress);

  if ((await ethers.provider.getCode(deploymentAddress)) == "0x") {
    var codeDeploy = await factory.deploy(
      ethers.utils.hexConcat([
        EIP20.bytecode
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
        abiCoder.encode(["address","bytes"],deployArgs),
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
