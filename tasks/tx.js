require("dotenv").config();

task("tx", "Run a transaction against the contract ABI")
    .addParam("functionName", "The contract function to call here")
    .addParam("functionArgs", "The contract function arguments to be run here")
    .addParam("address", "The contract to attach too")
    .addOptionalParam("gasLimit", "The gas limit set for the transaction")
    .addOptionalParam("value", "The eth value given to the transaction")
    .setAction(async (taskArgs) => {
      const EIP20 = await ethers.getContractFactory("EIP20");

      const eip20 = await EIP20.attach(taskArgs.address);

      var functionArgsObject = JSON.parse(taskArgs.functionArgs);

      if (typeof(taskArgs.gasLimit) !== "undefined") {
        if (typeof(taskArgs.value) !== "undefined") {
          var result = await eip20[taskArgs.functionName](...functionArgsObject,{gasLimit : taskArgs.gasLimit,value : taskArgs.value});
        } else {
          var result = await eip20[taskArgs.functionName](...functionArgsObject,{gasLimit : taskArgs.gasLimit});
        }
      } else {
        if (typeof(taskArgs.value) !== "undefined") {
          var result = await eip20[taskArgs.functionName](...functionArgsObject,{value : taskArgs.value});
        } else {
          var result = await eip20[taskArgs.functionName](...functionArgsObject);
        }
      }

      console.log(result);
})

module.exports = {}
