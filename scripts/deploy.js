require("dotenv").config();

const { writeFileSync } = require("fs");
const { ethers, artifacts } = require("hardhat");
const readlinePromises = require('readline');

const rl = readlinePromises.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true,
});

rl.question('Arguments file for deployment: ', (constructorArgsFile) => {
  var argModule = require(process.cwd() + "/" + constructorArgsFile);

  deploy(argModule).catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });

  rl.close();
});

async function deploy(deployArgs) {
  const accounts = await ethers.getSigners();

  const abiCoder = new ethers.utils.AbiCoder();

  console.log("Deploying contracts with the account: ", accounts[0].address);

  console.log("Account balance: ", (await accounts[0].getBalance()).toString());

  if (process.env.GOERLI_FACTORY_CONTRACT == null) {
    const Factory = await ethers.getContractFactory("Factory");

    var factory = await Factory.deploy();

    console.log("Transaction hash of the factory deployment: ", factory.deployTransaction.hash);

    await factory.deployed();

    console.log("Factory contract has been deployed at: ", factory.address);

    writeFileSync('.env','GOERLI_FACTORY_CONTRACT=\"' + factory.address + '\"\n',{flag:'a+'});
  } else {
    const Factory = await ethers.getContractFactory("Factory");

    var factory = await Factory.attach(process.env.GOERLI_FACTORY_CONTRACT);

    console.log("Factory contract has already been deployed at: ", process.env.GOERLI_FACTORY_CONTRACT);
  }

  const EIP20 = await ethers.getContractFactory("EIP20");

  const salt = ethers.utils.hexZeroPad(ethers.utils.hexlify(1),32);

  var deploymentAddress = await factory.getAddress(ethers.utils.hexConcat([
    EIP20.bytecode,
    abiCoder.encode(['string','string','(address airdropAddress,uint256 airdropAmount)[]'],deployArgs),
  ]),salt);

  console.log("Deployment address of contract from factory is: ",deploymentAddress);

  if ((await ethers.provider.getCode(deploymentAddress)) == '0x') {
    var codeDeploy = await factory.deploy(ethers.utils.hexConcat([
      EIP20.bytecode,
      abiCoder.encode(['string','string','(address airdropAddress,uint256 airdropAmount)[]'],deployArgs),
    ]),salt);

    console.log("Deployment of contract from factory transaction: ",codeDeploy.hash);

    await codeDeploy.wait();

    console.log("Deployment of contract from factory is complete");
  } else {
    console.log("Deployment of contract from factory has already been deployed");
  }
}
