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
npx hardhat run scripts/deploy.js
npx hardhat run scripts/initialize.js
npx hardhat run scripts/configure.js
```

Depending on if you have specified a constructor in the contract section you might need to add a arguments file as input. The following output assumes you have uncommented the constructor and use our given `scripts/arguments.js` file but the run without constructor will not need any input so in that case you can press enter to continue:

```bash
$ npx hardhat run scripts/factory.js
Compiled 2 Solidity files successfully
(node:255192) ExperimentalWarning: stream/web is an experimental feature. This feature could change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
Deploying contracts with the account:  0xA7b192eBA8E0B07e2D25c632986fA4cB2666bB9f
Account balance:  3161615962444600501
Transaction hash of the factory deployment:  0x87e11535dc4f00ee9a08fb668a7ac5eade17e493e080d01e747122594b66298e
Factory contract has been deployed at:  0x928F26d0F26E25820E159052Fa47c2F60D97A08a

$ npx hardhat run scripts/deploy.js
(node:255287) ExperimentalWarning: stream/web is an experimental feature. This feature could change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
Deploying contracts with the account:  0xA7b192eBA8E0B07e2D25c632986fA4cB2666bB9f
Account balance:  3159571507438876027
Factory contract has already been deployed at:  0x928F26d0F26E25820E159052Fa47c2F60D97A08a
Deployment address of EIP20 contract from factory is:  0xd5Aa6d6CA999fe736661653Ed430875B5f9a6a82
Deployment address of Proxy contract from factory is:  0x96D6A96b69Cb5eAcA43F41789cbD66aFE7F124Df
Deployment of EIP20 contract from factory transaction:  0x36d8f21b837cfd7800a06e43af0ae772cc48a9167fe696eedee60d45175536fc
Deployment of EIP20 contract from factory is complete
Deployment of Proxy contract from factory transaction:  0xa3c9deb1ddbbd4be8454f346e403cc831e8e0be2d289b26c0165f3d64a54ff7a
Deployment of Proxy contract from factory is complete

$ npx hardhat run scripts/initialize.js
(node:255526) ExperimentalWarning: stream/web is an experimental feature. This feature could change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
Deploying contracts with the account:  0xA7b192eBA8E0B07e2D25c632986fA4cB2666bB9f
Account balance:  3152463802418974453
Deployment address of EIP20 contract from factory is:  0xd5Aa6d6CA999fe736661653Ed430875B5f9a6a82
Deployment address of Proxy contract from factory is:  0x96D6A96b69Cb5eAcA43F41789cbD66aFE7F124Df
Initialization of EIP20 contract from factory transaction:  0x1ac041c1daf2d9dc4d4e0dcd0d70bf45cfcd26014eaf65c0c328d879e175a521
Initialization of EIP20 contract from factory is complete
Initialization of Proxy contract from factory transaction:  0x994bab249c86cd7080aa7613d49c6bfdffce6067633acda51de629ad00594564
Initialization of Proxy contract from factory is complete

$ npx hardhat run scripts/configure.js
(node:255636) ExperimentalWarning: stream/web is an experimental feature. This feature could change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
Deploying contracts with the account:  0xA7b192eBA8E0B07e2D25c632986fA4cB2666bB9f
Account balance:  3152215762418279941
Deployment address of EIP20 contract from factory is:  0xd5Aa6d6CA999fe736661653Ed430875B5f9a6a82
Deployment address of Proxy contract from factory is:  0x96D6A96b69Cb5eAcA43F41789cbD66aFE7F124Df
Configuration of contracts from factory transaction:  0xa3835cf9140281fe4c98bc9949b64cbd6cd5068cd523923e0ff1fac41a4079ec
Configuration of contracts from factory is complete
```

## Verify on etherscan

Now that this contract has been deployed it makes sense to verify the contracts code via etherscan. This means that you'll be able to view the contract and its solidity code on etherscan and also be able to interact with its functions via a web wallet. This is a key part of users being able to trust your code, after a deploy its possible for users to view the EVM opcodes and grasp an understanding of whats going on here but solidity is much clearer and commonly understood language and so translates the ideas better.

To run this verify on the deployed contract you run the following:

```bash
npx hardhat verify <contract-address> <factory-contract-address>
```

You can find the contract address from where it says `Contract has been deployed at:` and the constructor arguments file should be the same one you used as input to the `Arguments file for deployment:` section. You can see an example of this with the constructor defined bellow and after it will output the goerli etherscan page:

```bash
$ npx hardhat verify 0xd5Aa6d6CA999fe736661653Ed430875B5f9a6a82 0x928F26d0F26E25820E159052Fa47c2F60D97A08a
(node:255780) ExperimentalWarning: stream/web is an experimental feature. This feature could change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
Nothing to compile
Successfully submitted source code for contract
contracts/eip-20.sol:EIP20 at 0xd5Aa6d6CA999fe736661653Ed430875B5f9a6a82
for verification on the block explorer. Waiting for verification result...

Successfully verified contract EIP20 on Etherscan.
https://sepolia.etherscan.io/address/0xd5Aa6d6CA999fe736661653Ed430875B5f9a6a82#code

$ npx hardhat verify 0x96D6A96b69Cb5eAcA43F41789cbD66aFE7F124Df 0x928F26d0F26E25820E159052Fa47c2F60D97A08a
(node:255815) ExperimentalWarning: stream/web is an experimental feature. This feature could change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
Nothing to compile
Successfully submitted source code for contract
contracts/proxy.sol:Proxy at 0x96D6A96b69Cb5eAcA43F41789cbD66aFE7F124Df
for verification on the block explorer. Waiting for verification result...

Successfully verified contract Proxy on Etherscan.
https://sepolia.etherscan.io/address/0x96D6A96b69Cb5eAcA43F41789cbD66aFE7F124Df#code
```

## Run a transaction

You might like to quickly run a transaction call against the deployed contract, this can be used for testing. The following is an example of function call on `name` with a deployed contract that has been setup with a constructor:

```bash
npx hardhat tx --function-name <contract-function-name> --function-args <contract-function-arguments> --address <contract-address>
```

Your out should look like the following:

```bash
npx hardhat tx --function-name name --function-args [] --address "0x96D6A96b69Cb5eAcA43F41789cbD66aFE7F124Df"
MyToken
```

## View logs

There might be a need to check that the `Transfer` event has been triggered and to debug its output. You can view the list of logs on the deployed contract by running the following:

```bash
npx hardhat logs --address <eip20-proxy-address>
```

Your output should then look like the following:

```bash
$ npx hardhat logs --address "0x96D6A96b69Cb5eAcA43F41789cbD66aFE7F124Df"
{
  event: 'Transfer',
  eventSignature: 'Transfer(address,address,uint256)',
  address: '0x96D6A96b69Cb5eAcA43F41789cbD66aFE7F124Df',
  data: '0x0000000000000000000000000000000000000000000000000de0b6b3a7640000',
  blockHash: '0x213097ac015aaf0a306082232a7f351fa583e3a67ee58bf2a09ba6bdbca9e3e0',
  transactionHash: '0xa3835cf9140281fe4c98bc9949b64cbd6cd5068cd523923e0ff1fac41a4079ec',
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
