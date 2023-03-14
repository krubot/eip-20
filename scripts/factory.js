require("dotenv").config();

const { writeFileSync } = require("fs");
const { ethers, network } = require("hardhat");

const networkName = network.name.toUpperCase();

async function deploy() {
  const accounts = await ethers.getSigners();

  console.log("Deploying contracts with the account: ", accounts[0].address);

  console.log("Account balance: ", (await accounts[0].getBalance()).toString());

  if (process.env[networkName + "_FACTORY_CONTRACT"] == null) {
    const Factory = await ethers.getContractFactory("Factory");

    var factory = await Factory.deploy(accounts[0].address);

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

deploy().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
