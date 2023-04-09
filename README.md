# Hardhat implementation of eip-20

This repo deploys an implementation of the eip-20 standard for learning. It uses hardhat package to run deployments on ethereum goerli network. Please read up on the eip-20 standard [here](https://eips.ethereum.org/EIPS/eip-20) to get further information.

## Setup

To setup this repo firstly make sure you clone a local copy of this repo down to your workspace using git. Next download all the node modules needed here by running the following:

```bash
npm install
```

Now you'll need to setup the environment variable to be used in the deployment by creating a `.env` file with the following content:

```bash
GOERLI_RPC_URL="<goerli-rpc-url>"
PRIVATE_KEY=["<private-key-1>","<private-key-2>",...]
ETHERSCAN_API_KEY="<ertherscan-api-key>" # Optional variable although it will be needed if running a verify on this contract
DEBUG_OUTPUT=False
```

You can use a rpc provider like `infura` and `Alchemy` for goerli and your private key can be grabbed from metamask. **Please make sure not to commit your .env file up, this can lead to loss of funds.**

To find the Etherscan API key you can follow this guide [here](https://info.etherscan.com/api-keys/).

## Compile and deploy

To compile this solidity code you'll need to run hardhat cli using `npx` like the following:

```bash
npx hardhat compile
```

Now you should be able to deploy your contract to goerli or sepolia networks. To do this run the following:

```bash
npx hardhat run scripts/factory.js
npx hardhat run scripts/logic.js
npx hardhat run scripts/proxy.js

Depending on if you have specified a constructor in the contract section you might need to add a arguments file as input. The following output assumes you have uncommented the constructor and use our given `scripts/arguments.js` file but the run without constructor will not need any input so in that case you can press enter to continue:

```bash
$ npx hardhat run scripts/factory.js && npx hardhat run scripts/logic.js && npx hardhat run scripts/proxy.js
Compiled 23 Solidity files successfully
(node:247091) ExperimentalWarning: stream/web is an experimental feature. This feature could change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
Deploying contracts with the account:  0x4Bb831A4E7947f6C191DB9c5bccD4aD584e96C87
Account balance:  478687569801286938
Transaction hash of the factory deployment:  0x75433060cc98b3bd947c90a0cd4796c70623462e956a6c3e76d1c34da6b58b4a
Factory contract has been deployed at:  0x48A49d1B792AD5F0C5af7CB3f00414C84EE04536
(node:247131) ExperimentalWarning: stream/web is an experimental feature. This feature could change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
Deploying contracts with the account:  0x4Bb831A4E7947f6C191DB9c5bccD4aD584e96C87
Account balance:  478542286210971984
Factory contract has already been deployed at:  0x48A49d1B792AD5F0C5af7CB3f00414C84EE04536
Deployment address of Token contract from factory is:  0xBEF75c7Aa46D9bF929c9641FEbde9D4447b10595
Deployment of Token contract from factory transaction:  0xfe977ebf1cd373be73813dbc0c1abffcea329689b67777d75d458cd8aa5c2e58
Deployment of Token contract from factory is complete
(node:247186) ExperimentalWarning: stream/web is an experimental feature. This feature could change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
Deploying contracts with the account:  0x4Bb831A4E7947f6C191DB9c5bccD4aD584e96C87
Account balance:  478104426687626493
Deployment address of Token contract from factory is:  0xBEF75c7Aa46D9bF929c9641FEbde9D4447b10595
Deployment address of Proxy Token contract from factory is:  0x17C04Dc5dAd7578BB49fdcc2f78Def1b6C2999ff
Deployment of Token Proxy contract from factory transaction:  0x5eb244fe193df5bae1d0c8f4bc57a9950c2ce6e45edb94f10ea1313cddec23d5
Deployment of Token Proxy contract from factory is complete
```

## Verify on etherscan

Now that this contract has been deployed it makes sense to verify the contracts code via etherscan. This means that you\'ll be able to view the contract and its solidity code on etherscan and also be able to interact with its functions via a web wallet. This is a key part of users being able to trust your code, after a deploy its possible for users to view the EVM opcodes and grasp an understanding of whats going on here but solidity is much clearer and commonly understood language and so translates the ideas better.

To run this verify on the deployed contract you run the following:

```bash
npx hardhat verify <contract-address> <list-of-constructor-arguments>
```

The following is an example of how you might run a verify on the `factory`,`token` and `proxy` contracts respectively:

```bash
$ npx hardhat verify 0x5Ee614Be01c200183257863D4091813180D2d42B 0x4Bb831A4E7947f6C191DB9c5bccD4aD584e96C87
(node:247878) ExperimentalWarning: stream/web is an experimental feature. This feature could change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
Nothing to compile
Successfully submitted source code for contract
contracts/factory.sol:Factory at 0x5Ee614Be01c200183257863D4091813180D2d42B
for verification on the block explorer. Waiting for verification result...

Successfully verified contract Factory on Etherscan.
https://sepolia.etherscan.io/address/0x5Ee614Be01c200183257863D4091813180D2d42B#code
$ npx hardhat verify 0xce45f83A157Cb4Fd713E019Ed53E6fb53D4488Dc
(node:247923) ExperimentalWarning: stream/web is an experimental feature. This feature could change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
Nothing to compile
Successfully submitted source code for contract
contracts/token.sol:Token at 0xce45f83A157Cb4Fd713E019Ed53E6fb53D4488Dc
for verification on the block explorer. Waiting for verification result...

Successfully verified contract Factory on Etherscan.
https://sepolia.etherscan.io/address/0xce45f83A157Cb4Fd713E019Ed53E6fb53D4488Dc#code
$ calldata=$(npx hardhat calldata --abi '[{"inputs":[{"internalType":"string","name":"name_","type":"string"},{"internalType":"string","name":"symbol_","type":"string"},{"components":[{"internalType":"address","name":"airdropAddress","type":"address"},{"internalType":"uint256","name":"airdropAmount","type":"uint256"}],"internalType":"struct Token.airdrop[]","name":"airdrop_","type":"tuple[]"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"}]' --function 'initialize(string,string,(address,uint256)[])' --values '["MyToken","HIX",[{"airdropAddress": "0xA7b192eBA8E0B07e2D25c632986fA4cB2666bB9f","airdropAmount": "1000000000000000000"}]]')
$ npx hardhat verify --contract contracts/proxy.sol:TransparentProxy 0x17C04Dc5dAd7578BB49fdcc2f78Def1b6C2999ff 0xBEF75c7Aa46D9bF929c9641FEbde9D4447b10595 0x48A49d1B792AD5F0C5af7CB3f00414C84EE04536 $calldata
(node:248534) ExperimentalWarning: stream/web is an experimental feature. This feature could change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
Nothing to compile
Successfully submitted source code for contract
contracts/proxy.sol:TransparentProxy at 0x17C04Dc5dAd7578BB49fdcc2f78Def1b6C2999ff
for verification on the block explorer. Waiting for verification result...

Successfully verified contract TransparentProxy on Etherscan.
https://sepolia.etherscan.io/address/0x17C04Dc5dAd7578BB49fdcc2f78Def1b6C2999ff#code
```

## Run a transaction

You might like to quickly run a transaction call against the deployed contract, this can be used for testing. The following is an example of function call on `name` with a deployed contract that has been setup with a constructor:

```bash
npx hardhat tx --address <contract-address> --contract <contract-name> --function-name <contract-function-name> --function-args <contract-function-arguments>
```

Your out should look like the following:

```bash
$ npx hardhat tx --address "0x17C04Dc5dAd7578BB49fdcc2f78Def1b6C2999ff" --contract "Token" --function-name name --function-args []
(node:248915) ExperimentalWarning: stream/web is an experimental feature. This feature could change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
Function has given the following output:  MyToken
```

## View logs

There might be a need to check that the `Transfer` event has been triggered and to debug its output. You can view the list of logs on the deployed contract by running the following:

```bash
npx hardhat logs --address <eip20-proxy-address> --contract <contract-name>
```

Your output should then look like the following:

```bash
$ npx hardhat logs --address 0x17C04Dc5dAd7578BB49fdcc2f78Def1b6C2999ff --contract Token
(node:249054) ExperimentalWarning: stream/web is an experimental feature. This feature could change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
{
  event: undefined,
  eventSignature: undefined,
  address: '0x17C04Dc5dAd7578BB49fdcc2f78Def1b6C2999ff',
  data: '0x',
  blockHash: '0xece4af9ea344d7c6376c99275b4b16ee73e6628e74739527fc9028ca675736a8',
  transactionHash: '0x5eb244fe193df5bae1d0c8f4bc57a9950c2ce6e45edb94f10ea1313cddec23d5',
  topics: [
    '0xbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b',
    '0x000000000000000000000000bef75c7aa46d9bf929c9641febde9d4447b10595'
  ],
  args: undefined
}
{
  event: 'Transfer',
  eventSignature: 'Transfer(address,address,uint256)',
  address: '0x17C04Dc5dAd7578BB49fdcc2f78Def1b6C2999ff',
  data: '0x0000000000000000000000000000000000000000000000000de0b6b3a7640000',
  blockHash: '0xece4af9ea344d7c6376c99275b4b16ee73e6628e74739527fc9028ca675736a8',
  transactionHash: '0x5eb244fe193df5bae1d0c8f4bc57a9950c2ce6e45edb94f10ea1313cddec23d5',
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
...
```

## Cancel transactions

Sometimes you might have long running pending transactions that need to be canceled. This can be because you've set the gas price too low or maybe nodes for other reasons don't want to build that transaction into a new block. You can cancel any pending transaction by deploying a new one with the same nonce as that transaction will no data. This is all automated by running a hardhat cancel task as follows:

```bash
npx hardhat cancel
```

An example output of this command has been run bellow:

```bash
$ npx hardhat cancel
Nonce of the transactions to cancel is:  248
Submitted tx hash is:  0x6d97fc975a89262ecaabf2ec24ba60413e079a0b55dc75d39c75612758ab99ef
Transactions have now been cancelled
```
