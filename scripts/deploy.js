require("dotenv").config();

const { writeFileSync } = require("fs");
const { ethers } = require("hardhat");
const readlinePromises = require('readline');

const rl = readlinePromises.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true,
});

rl.question('Arguments file for deployment: ', (constructorArgsFile) => {
  if (constructorArgsFile != "") {
    var argModule = require(process.cwd() + "/" + constructorArgsFile);
  } else {
    var argModule = "";
  }

  deploy(argModule).catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });

  rl.close();
});

async function deploy(deployArgs) {
  const accounts = await ethers.getSigners();

  console.log("Deploying contracts with the account: ", accounts[0].address);

  console.log("Account balance: ", (await accounts[0].getBalance()).toString());

  if (process.env.GOERLI_EIP_20_CONTRACT == null) {
    const EIP20 = await ethers.getContractFactory("EIP20");

    const eip20 = await EIP20.deploy(...deployArgs);

    console.log("Transaction hash of the deployment: ", eip20.deployTransaction.hash);

    await eip20.deployed();

    console.log("Contract has been deployed at: ", eip20.address);

    writeFileSync('.env','GOERLI_EIP_20_CONTRACT=\"' + eip20.address + '\"\n',{flag:'a+'});
  } else {
    console.log("Contract has already been deployed at: ", process.env.GOERLI_EIP_20_CONTRACT);
  }
}
