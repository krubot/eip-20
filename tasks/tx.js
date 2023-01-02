require("dotenv").config();

task("tx", "Run a transaction against the contract ABI")
    .addParam("functionName", "The contract function to call here")
    .addParam("functionArgs", "The contract function arguments to be run here")
    .setAction(async (taskArgs) => {
      const EIP20 = await ethers.getContractFactory("EIP20");

      if (process.env.GOERLI_EIP_20_CONTRACT == null) {
        console.error("Contract has not been deployed, please deploy first using hardhat.");
        return
      }

      const eip20 = await EIP20.attach(process.env.GOERLI_EIP_20_CONTRACT);

      const result = await eip20[taskArgs.functionName](...taskArgs.functionArgs);

      console.log(result);
})

module.exports = {}
