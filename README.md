# Hardhat implementation of eip-20

This repo deploys an implementation of the eip-20 standard for learning. It uses hardhat package to run deployments on ethereum goerli network. Please read up on the eip-20 standard [here](https://eips.ethereum.org/EIPS/eip-20) to get further information.

## Setup

To setup this repo firstly make sure you clone a local copy of this repo down to your workspace using git. Next download all the node modules needed here by running the following:

```
npm install
```

Now you'll need to setup the environment variable to be used in the deployment by creating a `.env` file with the following content:

```
GOERLI_RPC_URL="<goerli-rpc-url>"
PRIVATE_KEY=["<private-key-1>","<private-key-2>",...]
ETHERSCAN_API_KEY="<ertherscan-api-key>" // Optional variable although it will be needed if running a verify on this contract
```

You can use a rpc provider like `infura` and `Alchemy` for goerli and your private key can be grabbed from metamask. **Please make sure not to commit your .env file up, this can lead to loss of funds.**

To find the Etherscan API key you can follow this guide [here](https://info.etherscan.com/api-keys/).

## Contract

Note that before you compile and deploy, if you are just using this contract by itself or you don't want to initialize it externally you will likely want to uncomment the constructor function. It will look like the following:

```
// Uncomment if running without a proxy initilisation
// constructor(string memory name_,string memory symbol_,airdrop[] memory airdrop_) {
//   initialize(name_,symbol_,airdrop_);
// }
```

This will then require arguments for the deployment which will be discussed in the next section.

## Compile and deploy

To compile this solidity code you'll need to run hardhat cli using `npx` like the following:

```
npx hardhat compile
```

Now you should be able to deploy your contract to goerli. To do this run the following:

```
npx hardhat run scripts/deploy.js
```

Depending on if you have specified a constructor in the contract section you might need to add a arguments file as input. The following output assumes you have uncommented the constructor and use our given `scripts/arguments.js` file but the run without constructor will not need any input so in that case you can press enter to continue:

```
Compiled 1 Solidity file successfully
Arguments file for deployment: scripts/arguments.js
(node:2183596) ExperimentalWarning: stream/web is an experimental feature. This feature could change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
Deploying contracts with the account:  0xA7b192eBA8E0B07e2D25c632986fA4cB2666bB9f
Account balance:  291799725588525442
Transaction hash of the deployment:  0xc4a539e39404904061f7f5d3299d952ef63e30332a9c156d072b9f5718449892
Contract has been deployed at:  0x0F7aCFE8A171B001D9f9826122c8fc3fAc117D65
```

## Verify on etherscan

Now that this contract has been deployed it makes sense to verify the contracts code via etherscan. This means that you'll be able to view the contract and its solidity code on etherscan and also be able to interact with its functions via a web wallet. This is a key part of users being able to trust your code, after a deploy its possible for users to view the EVM opcodes and grasp an understanding of whats going on here but solidity is much clearer and commonly understood language and so translates the ideas better.

To run this verify on the deployed contract you run the following:

```
npx hardhat verify <contract-address> --constructor-args <constructor-arguments-file>
```

You can find the contract address from where it says `Contract has been deployed at:` and the constructor arguments file should be the same one you used as input to the `Arguments file for deployment:` section. You can see an example of this with the constructor defined bellow and after it will output the goerli etherscan page:

```
(node:2017592) ExperimentalWarning: stream/web is an experimental feature. This feature could change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
Nothing to compile
Successfully submitted source code for contract
contracts/eip-20.sol:EIP20 at 0x0F7aCFE8A171B001D9f9826122c8fc3fAc117D65
for verification on the block explorer. Waiting for verification result...

Successfully verified contract EIP20 on Etherscan.
https://goerli.etherscan.io/address/0x0F7aCFE8A171B001D9f9826122c8fc3fAc117D65#code
```

## View logs

There might be a need to check that the `Transfer` event has been triggered and to debug its output. You can view the list of logs on the deployed contract by running the following:

```
npx hardhat logs
```

Your output should then look like the following:

```
(node:2188608) ExperimentalWarning: stream/web is an experimental feature. This feature could change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
{
  event: 'Transfer',
  eventSignature: 'Transfer(address,address,uint256)',
  address: '0x0F7aCFE8A171B001D9f9826122c8fc3fAc117D65',
  data: '0x0000000000000000000000000000000000000000000000000de0b6b3a7640000',
  blockHash: '0x37c22cf48856b7cd59e01e949c6a1c56ff7d8509633bdff0da92eb1f3eeccf43',
  transactionHash: '0xc4a539e39404904061f7f5d3299d952ef63e30332a9c156d072b9f5718449892',
  topics: [
    '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
    '0x0000000000000000000000000000000000000000000000000000000000000000',
    '0x000000000000000000000000a7b192eba8e0b07e2d25c632986fa4cb2666bb9f'
  ],
  args: [
    '0x0000000000000000000000000000000000000000',
    '0xA7b192eBA8E0B07e2D25c632986fA4cB2666bB9f',
    BigNumber { value: "1000000000000000000" },
    from: '0x0000000000000000000000000000000000000000',
    to: '0xA7b192eBA8E0B07e2D25c632986fA4cB2666bB9f',
    value: BigNumber { value: "1000000000000000000" }
  ]
}
```
