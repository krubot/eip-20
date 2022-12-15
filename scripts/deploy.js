require("dotenv").config();

const { writeFileSync } = require("fs");
const { ethers } = require("hardhat");

async function main() {
  const [account] = await ethers.getSigners();

  console.log("Deploying contracts with the account: ", account.address);

  console.log("Account balance: ", (await account.getBalance()).toString());

  if (process.env.GOERLI_EIP_20_CONTRACT == null) {
    const Example = await ethers.getContractFactory("Example");
    const example = await Example.deploy("MyToken","HIX",1000000);

    console.log("Transaction hash of the deployment: ", example.deployTransaction.hash);

    await example.deployed();

    console.log("Contract has been deployed at: ", example.address);

    writeFileSync('.env','GOERLI_EIP_20_CONTRACT=\'' + example.address + '\'\n',{flag:'a+'});
  } else {
    console.log("Contract has already been deployed at: ", process.env.GOERLI_EIP_20_CONTRACT);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
