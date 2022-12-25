require("dotenv").config();

task("logs", "Gets the Transfer logs on the current contract", async () => {
  const accounts = await ethers.getSigners()

  const EIP20 = await ethers.getContractFactory("EIP20");

  if (process.env.GOERLI_EIP_20_CONTRACT == null) {
    console.error("Contract has not been deployed, please deploy first using hardhat.");
    return
  }

  var eip20 = EIP20.attach(process.env.GOERLI_EIP_20_CONTRACT);

  let eventFilter = eip20.filters.Transfer();

  let events = await eip20.queryFilter(eventFilter);

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
