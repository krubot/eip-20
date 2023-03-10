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

Now you should be able to deploy your contract to goerli. To do this run the following:

```bash
npx hardhat run scripts/factory.js
npx hardhat run scripts/deploy.js
```

Depending on if you have specified a constructor in the contract section you might need to add a arguments file as input. The following output assumes you have uncommented the constructor and use our given `scripts/arguments.js` file but the run without constructor will not need any input so in that case you can press enter to continue:

```bash
$ npx hardhat run scripts/factory.js
Does factory contract exist (true/false): false
Deploying contracts with the account:  0xA7b192eBA8E0B07e2D25c632986fA4cB2666bB9f
Account balance:  3730213907397598723
Transaction hash of the factory deployment:  0x10acf5cf5f0c45d3c758b25fe70c5bb2a9fafbf9a6bfb71c9b5502f0c098e7e0
Factory contract has been deployed at:  0xc0c4548729014da06976ad1337F59803e85166C9
$ npx hardhat run scripts/deploy.js
Arguments file for deployment: scripts/arguments.js
Deploying contracts with the account:  0xA7b192eBA8E0B07e2D25c632986fA4cB2666bB9f
Account balance:  3729527651065838027
Factory contract has already been deployed at:  0xc0c4548729014da06976ad1337F59803e85166C9
Deployment address of EIP20 contract from factory is:  0x2E9a7f274021A098ed6CC8B2152A7987c3885b7F
Deployment address of Proxy contract from factory is:  0xdB836d76d1BF33Afe2000e4DcFB46dE6e01e5179
Deployment of EIP20 contract from factory transaction:  0x9c27cded8c51dc07f9853a3d66e6e650c293025320c4fa33dd7fa85969753c18
Deployment of EIP20 contract from factory is complete
Deployment of Proxy contract from factory transaction:  0x1534a99e76722ac7eca73ec7a34cf8bccf8249c0692ed9b59416b8dc13ee3ec6
Deployment of Proxy contract from factory is complete

```

## Verify on etherscan

Now that this contract has been deployed it makes sense to verify the contracts code via etherscan. This means that you'll be able to view the contract and its solidity code on etherscan and also be able to interact with its functions via a web wallet. This is a key part of users being able to trust your code, after a deploy its possible for users to view the EVM opcodes and grasp an understanding of whats going on here but solidity is much clearer and commonly understood language and so translates the ideas better.

To run this verify on the deployed contract you run the following:

```bash
npx hardhat verify <contract-address> --constructor-args <constructor-arguments-file>
```

You can find the contract address from where it says `Contract has been deployed at:` and the constructor arguments file should be the same one you used as input to the `Arguments file for deployment:` section. You can see an example of this with the constructor defined bellow and after it will output the goerli etherscan page:

```bash
$ npx hardhat verify 0xc0c4548729014da06976ad1337F59803e85166C9
Nothing to compile
Successfully submitted source code for contract
contracts/factory.sol:Factory at 0xc0c4548729014da06976ad1337F59803e85166C9
for verification on the block explorer. Waiting for verification result...

Error in plugin @nomiclabs/hardhat-etherscan: The Etherscan API responded with a failure status.
The verification may still succeed but should be checked manually.
Reason: Already Verified

For more info run Hardhat with --show-stack-traces
$ npx hardhat verify 0x2E9a7f274021A098ed6CC8B2152A7987c3885b7F
Nothing to compile
Successfully submitted source code for contract
contracts/eip-20.sol:EIP20 at 0x2E9a7f274021A098ed6CC8B2152A7987c3885b7F
for verification on the block explorer. Waiting for verification result...

Error in plugin @nomiclabs/hardhat-etherscan: The Etherscan API responded with a failure status.
The verification may still succeed but should be checked manually.
Reason: Already Verified

For more info run Hardhat with --show-stack-traces
$ npx hardhat verify 0xdB836d76d1BF33Afe2000e4DcFB46dE6e01e5179 --constructor-args scripts/arguments.js
Nothing to compile
Successfully submitted source code for contract
contracts/proxy.sol:Proxy at 0xdB836d76d1BF33Afe2000e4DcFB46dE6e01e5179
for verification on the block explorer. Waiting for verification result...

Error in plugin @nomiclabs/hardhat-etherscan: The Etherscan API responded with a failure status.
The verification may still succeed but should be checked manually.
Reason: Already Verified

For more info run Hardhat with --show-stack-traces
```

## Run a transaction

You might like to quickly run a transaction call against the deployed contract, this can be used for testing. The following is an example of function call on `name` with a deployed contract that has been setup with a constructor:

```bash
npx hardhat tx --function-name <contract-function-name> --function-args <contract-function-arguments> --address <contract-address>
```

Your out should look like the following:

```bash
npx hardhat tx --function-name name --function-args [] --address "0x11498137d94CbE5485Dc1B1225Dc0fbBD640D83b"
MyToken
```

## View logs

There might be a need to check that the `Transfer` event has been triggered and to debug its output. You can view the list of logs on the deployed contract by running the following:

```bash
npx hardhat logs
```

Your output should then look like the following:

```bash
$ npx hardhat logs
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
