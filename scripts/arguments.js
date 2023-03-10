require("dotenv").config();

const EIP20 = require("../build/artifacts/contracts/eip-20.sol/EIP20.json")

const { ethers, artifacts, network } = require("hardhat");

function calldata(implementationABI,implementationInitialize,implementationArgs) {
  const signer = new ethers.Wallet(JSON.parse(process.env.PRIVATE_KEYS)[0]);

  const networkName = network.name.toUpperCase();

  const factoryAddress = process.env[networkName + "_FACTORY_CONTRACT"];

  const salt = ethers.utils.hexZeroPad(ethers.utils.hexlify(0),32);

  const implementation = new ethers.utils.Interface(implementationABI);

  const calldata = implementation.encodeFunctionData(implementationInitialize,implementationArgs);

  var eip20Address = ethers.utils.getCreate2Address(factoryAddress,salt,ethers.utils.keccak256(EIP20.bytecode));

  return [eip20Address,calldata]
}

module.exports = calldata(
  [
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "name_",
          "type": "string"
        },{
          "internalType": "string",
          "name": "symbol_",
          "type": "string"
        },{
          "components": [
            {
              "internalType": "address",
              "name": "airdropAddress",
              "type": "address"
            },{
              "internalType": "uint256",
              "name": "airdropAmount",
              "type": "uint256"
            }
          ],
          "internalType": "struct EIP20.airdrop[]",
          "name": "airdrop_",
          "type": "tuple[]"
        }
      ],
      "name": "initialize",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ], // Implementation contract initialization ABI
  "initialize(string,string,(address,uint256)[])", // Implementation contract initialization encoded function
  [
  	"MyToken",
  	"HIX",
  	[
  		{
  			"airdropAddress": "0xA7b192eBA8E0B07e2D25c632986fA4cB2666bB9f",
  			"airdropAmount": "1000000000000000000"
  		}
  	]
  ] // Implementation contract initialization arguments
);
