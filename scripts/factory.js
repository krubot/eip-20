require("dotenv").config();

const { writeFileSync } = require("fs");
const { ethers, artifacts, network } = require("hardhat");
const readlinePromises = require("readline");

const networkName = network.name.toUpperCase();

const readline = readlinePromises.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true,
});

async function main() {
  var factoryContractExists = await new Promise(resolve => readline.question("Does factory contract exist (true/false): ", ans => {resolve(ans);}));

  var boolFactoryContractExists = (String(factoryContractExists).toLowerCase() === "true");

  if(boolFactoryContractExists) {
    var factoryAddress = await new Promise(resolve => readline.question("Factory address: ", ans => {resolve(ans);}));
    writeFileSync(".env",networkName + "_FACTORY_CONTRACT=\"" + factoryAddress + "\"\n",{flag:"a+"});
  } else {
    deploy().catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
  }

  readline.close();
}

async function deploy() {
  const accounts = await ethers.getSigners();

  console.log("Deploying contracts with the account: ", accounts[0].address);

  console.log("Account balance: ", (await accounts[0].getBalance()).toString());

  if (process.env[networkName + "_FACTORY_CONTRACT"] == null) {
    const Factory = await ethers.getContractFactory("Factory");

    var factory = await Factory.deploy();

    console.log("Transaction hash of the factory deployment: ", factory.deployTransaction.hash);

    await factory.deployed();

    console.log("Factory contract has been deployed at: ", factory.address);

    writeFileSync(".env",networkName + "_FACTORY_CONTRACT=\"" + factory.address + "\"\n",{flag:"a+"});
  } else {
    const Factory = await ethers.getContractFactory("Factory");

    var factory = await Factory.attach(process.env[networkName + "_FACTORY_CONTRACT"]);

    console.log("Factory contract has already been deployed at: ", process.env[networkName + "_FACTORY_CONTRACT"]);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
