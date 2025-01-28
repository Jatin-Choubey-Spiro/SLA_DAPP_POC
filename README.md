# SLA Signing DApp

A decentralized application (DApp) for signing and managing Service Level Agreements (SLAs) on the blockchain.

---

## 🚀 Tech Stack
- **Solidity Compiler**: `v0.8.0 (solc-js)`
- **Truffle**: `v5.11.5`
- **Ganache CLI**: `v7.9.1`
- **Node.js**: `v20.18.1`
- **Web3.js**: `v1.10.0`
- **MetaMask Wallet**
- **Ganache UI**: `v2.7.1.0`

> **Note:** Ganache CLI does not support EIP-1559.

---

## ⚙️ Prerequisites

### Set Up Local Test Environment (Ganache UI)

1. **Initialize Truffle Project**  
   ```bash
    truffle init
    npm install

2. **Run the Ganache UI and quickstart, Ethereum Project**

3. **Add a network manually in Metamask for the Ganache UI and switch to it**
- **RPC URL:** HTTP:\\127.0.0.1:7545
- **ChainID:** 1337

4. **Import the first two private keys.**

## 📜 Deploy and Interact with the DApp
1. **Compile the Smart Contract**
    ```bash
    truffle compile
2. **Deploy the contract**
    ```bash
    truffle migrate --network <network>
3. **verify and Publish the Contract.**
- install the truffle verification plugin
    ```bash
    npm install --save-dev truffle-plugin-verify
- Verify and publish on Etherscan
    ```bash
    truffle run verify <contractName> --network sepolia

4. **Move the newly created build folder, consisting of Contracts ABI .json file, to the frontend's src folder.(So that frontend can interact with the smart contract)**

5. **Run the Server ```node .\frontend\server\server.js**

6. ```bash
    cd frontend
    npm start

7. **Login**

8. **Connect Wallet 1 and Explore**