require("dotenv").config();

task("encode", "Encodes the abi data values")
    .addParam("types", "The types to be encoded")
    .addParam("values", "The values to be encoded")
    .setAction(async (taskArgs) => {
      const abiCoder = new ethers.utils.AbiCoder();
      console.log(abiCoder.encode(JSON.parse(taskArgs.types),JSON.parse(taskArgs.values)));
})

module.exports = {}
