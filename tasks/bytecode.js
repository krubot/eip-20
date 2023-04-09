require("dotenv").config();

task("bytecode", "Returns the bytecode for the contract specified")
    .addParam("contract", "The contract name for the returned bytecode")
    .addOptionalParam("concat", "Combine with your own bytecode")
    .setAction(async (taskArgs) => {
      const Contract = await ethers.getContractFactory(taskArgs.contract);

      if (typeof(taskArgs.combine) !== "undefined") {
        console.log(ethers.utils.hexConcat([Contract.bytecode,taskArgs.concat]));
      } else {
        console.log(Contract.bytecode);
      }
})

module.exports = {}
