require("dotenv").config();

task("calldata", "Calldata encode data here")
    .addParam("abi", "The abi object to be encoded")
    .addParam("function", "The function data to be encoded")
    .addParam("values", "The function values to be encoded")
    .setAction(async (taskArgs) => {
      const implementation = new ethers.utils.Interface(JSON.parse(taskArgs.abi));

      const calldata = implementation.encodeFunctionData(taskArgs.function,JSON.parse(taskArgs.values));

      console.log(calldata);
})

module.exports = {}
