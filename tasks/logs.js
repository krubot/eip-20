require("dotenv").config();

task("logs", "Gets the Transfer logs on the current contract")
  .addParam("address", "The contract to attach too")
  .addParam("contract", "Contract name to call too")
  .addOptionalParam("event", "Event to listen out for")
  .setAction(async (taskArgs) => {
  const accounts = await ethers.getSigners()

  const Contract = await ethers.getContractFactory(taskArgs.contract);

  var contract = Contract.attach(taskArgs.address);

  if (typeof(taskArgs.event) == "undefined") {
    var eventFilter = contract.filters;
  } else {
    var eventFilter = contract.filters[taskArgs.event]();
  }

  let events = await contract.queryFilter(eventFilter);

  for (let event of events) {
    console.log({
      event: event.event,
      eventSignature: event.eventSignature,
      address: event.address,
      data: event.data,
      blockHash: event.blockHash,
      transactionHash: event.transactionHash,
      topics: event.topics,
      args: event.args
    });
  }
})

module.exports = {}
