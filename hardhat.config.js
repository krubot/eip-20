require("@nomicfoundation/hardhat-toolbox")
require("dotenv").config()
require("./tasks")

let hardhat = {
  solidity: "0.8.12",
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./build/cache",
    artifacts: "./build/artifacts"
  }
};

if (process.env.GOERLI_RPC_URL != null) {
  hardhat.networks = {
    goerli: {
      url: process.env.GOERLI_RPC_URL,
      accounts: JSON.parse(process.env.PRIVATE_KEYS)
    }
  };
  hardhat.defaultNetwork = "goerli";
}

if (process.env.SEPOLIA_RPC_URL != null) {
  hardhat.networks = {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: JSON.parse(process.env.PRIVATE_KEYS)
    }
  };
  hardhat.defaultNetwork = "sepolia";
}

if (process.env.ETHERSCAN_API_KEY != null) {
  hardhat.etherscan = {
    apiKey: {
      goerli: process.env.ETHERSCAN_API_KEY,
      sepolia: process.env.ETHERSCAN_API_KEY
    }
  };
}

module.exports = hardhat;
