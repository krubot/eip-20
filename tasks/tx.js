require("dotenv").config();

task("tx", "Run a transaction against the contract ABI")
    .addParam("functionName", "The contract function to call here")
    .addParam("functionArgs", "The contract function arguments to be run here")
    .addParam("address", "The contract to attach too")
    .addParam("contract", "Contract name to call too")
    .addOptionalParam("gasLimit", "The gas limit set for the transaction")
    .addOptionalParam("value", "The eth value given to the transaction")
    .setAction(async (taskArgs) => {
      const Contract = await ethers.getContractFactory(taskArgs.contract);

      const contract = await Contract.attach(taskArgs.address);

      var functionArgsObject = JSON.parse(taskArgs.functionArgs);

      if (typeof(taskArgs.gasLimit) !== "undefined") {
        if (typeof(taskArgs.value) !== "undefined") {
          var tx = await contract[taskArgs.functionName](...functionArgsObject,{gasLimit : taskArgs.gasLimit,value : taskArgs.value});
        } else {
          var tx = await contract[taskArgs.functionName](...functionArgsObject,{gasLimit : taskArgs.gasLimit});
        }
      } else {
        if (typeof(taskArgs.value) !== "undefined") {
          var tx = await contract[taskArgs.functionName](...functionArgsObject,{value : taskArgs.value});
        } else {
          var tx = await contract[taskArgs.functionName](...functionArgsObject);
        }
      }

      if (typeof(tx.hash) !== "undefined") {
        console.log("Transaction with the following hash has been triggered: ",tx.hash);

        tx.wait();

        console.log("Transaction has gone through successfully");
      } else {
        console.log("Function has given the following output: ",tx);
      }
})

module.exports = {}
