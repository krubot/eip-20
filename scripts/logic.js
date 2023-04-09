require("dotenv").config();

const { ethers, network } = require("hardhat");

async function deploy(deployArgs) {
  const accounts = await ethers.getSigners();

  const networkName = network.name.toUpperCase()

  const abiCoder = new ethers.utils.AbiCoder();

  const tokenSalt = ethers.utils.hexZeroPad(ethers.utils.hexlify(0),32);

  console.log("Deploying contracts with the account: ", accounts[0].address);

  console.log("Account balance: ", (await accounts[0].getBalance()).toString());

  const Factory = await ethers.getContractFactory("Factory");

  var factory = await Factory.attach(process.env[networkName + '_FACTORY_CONTRACT']);

  console.log("Factory contract has already been deployed at: ", process.env[networkName + '_FACTORY_CONTRACT']);

  const Token = await ethers.getContractFactory("Token");

  var tokenBytecode = ethers.utils.hexConcat([
    Token.bytecode,
    abiCoder.encode(["address"],[process.env[networkName + '_FACTORY_CONTRACT']]),
  ]);

  var deploymentAddress = await factory.getAddress(tokenBytecode,tokenSalt);

  console.log("Deployment address of Token contract from factory is: ",deploymentAddress);

  if ((await ethers.provider.getCode(deploymentAddress)) == "0x") {
    var codeDeploy = await factory.deploy(tokenBytecode,tokenSalt);

    if (process.env.DEBUG_OUTPUT) {
      console.log("Deployment of Token bytecode: ",tokenBytecode);

      console.log("Deployment of Token salt: ",tokenSalt);
    }

    console.log("Deployment of Token contract from factory transaction: ",codeDeploy.hash);

    await codeDeploy.wait();

    console.log("Deployment of Token contract from factory is complete");
  } else {
    console.log("Deployment of Token contract from factory has already been deployed");
  }
}

deploy().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
