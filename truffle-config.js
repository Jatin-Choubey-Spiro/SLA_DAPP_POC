const HDWalletProvider = require('@truffle/hdwallet-provider');
require('dotenv').config();
// const getGasPrice = require('./utils/gasPrice');
module.exports = {
  networks: {
    ganacheUI: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
    },
    ganacheCLI: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 8545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
    },
    sepolia: {
      provider: () =>
        new HDWalletProvider(
          process.env.PRIVATE_KEY,
          process.env.SEPOLIA_RPC_URL,
        ),
      network_id: 11155111, // 11155111
      confirmations: 3,   // Number of confirmations to wait between deployments
      timeoutBlocks: 200, // Number of blocks before a deployment times out
      skipDryRun: false,   // Skip dry run before migrations
    },
    // holesky: {
    //   provider: () =>
    //     new HDWalletProvider(
    //       process.env.PRIVATE_KEY,
    //       process.env.HOLESKY_RPC_URL
    //     ),
    //   network_id: 17000, // 17000
    //   confirmations: 3,
    //   networkCheckTimeout: 10000,
    //   timeoutBlocks: 200,
    //   skipDryRun: false,
    // }
  },

  // Set default mocha options here, use special reporters, etc.
  mocha: {
    reporter: 'eth-gas-reporter',
    reporterOptions: {
      currency: 'USD',
      outputFile: 'Gas_Reports.txt',
      noColors: true
    }
  },
  compilers: {
    solc: {
      version: "0.8.0",
    }
  },
  plugins: ['truffle-plugin-verify'],
  api_keys: {
    etherscan: process.env.ETHERSCAN_API_KEY
  },
};