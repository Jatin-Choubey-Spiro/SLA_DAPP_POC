import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from "./components/login";
import Home from "./components/Home";
import CreateMainAgreement from "./components/CreateMainAgreement";
import CreateSubAgreement from "./components/CreateSubAgreement";
import SignMainAgreement from "./components/SignMainAgreement";
import SignSubAgreement from "./components/SignSubAgreement";
import ViewMainAgreement from "./components/ViewMainAgreement";
import ViewSubAgreement from "./components/ViewSubAgreement";
import Layout from "./components/Layout"; // Import Layout component
import Web3 from "web3";
import SpiroAgreementManager from "./build/contracts/SpiroAgreementManager.json";

const contractAddress = "0x3368E14C56B43F25cEa50CBC380284652AECA47f";
const apiKey = "58cbbf110630457787d8a099f8b70b06"; // Your actual API key

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [account, setAccount] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [gasPrice, setGasPrice] = useState(null);
  const [ethPrice, setEthPrice] = useState(null);
  const [transactionCost, setTransactionCost] = useState(null);

  const handleLogin = () => {
    setIsAuthenticated(true); // Set authentication to true after login
  };

  useEffect(() => {
    if (window.ethereum) {
      const _web3 = new Web3(window.ethereum);
      setWeb3(_web3);

      const _contract = new _web3.eth.Contract(
        SpiroAgreementManager.abi,
        contractAddress
      );
      setContract(_contract);
    } else {
      alert("Please install MetaMask to use this DApp.");
    }
  }, []);

  const connectWallet = async () => {
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAccount(accounts[0]);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      alert("Failed to connect wallet. Please try again.");
    }
  };

  const fetchGasPrice = async () => {
    try {
      const response = await axios.get(`https://api.owlracle.info/v3/sepolia/gas?apikey=${apiKey}`);
      console.log(response.data); // Log the response data to inspect its structure
      setGasPrice(response.data.speeds);
    } catch (error) {
      console.error("Error fetching gas price:", error);
      alert("Failed to fetch gas price. Please try again.");
    }
  };

  const fetchEthPrice = async () => {
    try {
      const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
      setEthPrice(response.data.ethereum.usd);
    } catch (error) {
      console.error("Error fetching ETH price:", error);
      alert("Failed to fetch ETH price. Please try again.");
    }
  };

  const estimateTransactionCost = async () => {
    const gasUsed = 2267805;
  
    // Fetch the current gas price
    await fetchGasPrice();
    await fetchEthPrice();
  
    if (gasPrice && ethPrice) {
      // Assuming gasPrice[1].estimatedFee is the average gas price in Gwei
      const gasPriceInGwei = gasPrice[1].estimatedFee;
      const gasPriceInEth = gasPriceInGwei / 1e9; // Convert Gwei to ETH
  
      // Calculate the transaction cost in ETH
      const transactionCostInEth = gasUsed * gasPriceInEth;
  
      // Convert the transaction cost to USD
      const transactionCostInUsd = transactionCostInEth * ethPrice;
  
      setTransactionCost(transactionCostInUsd);
    } else {
      alert("Failed to fetch gas price or ETH price. Please try again.");
    }
  };

  useEffect(() => {
    fetchEthPrice();
  }, []);

  return (
    <Router>
      <div>
        {isAuthenticated ? (
          <Layout account={account} connectWallet={connectWallet}>
            <button onClick={fetchGasPrice}>Show Current Gas Price</button>
            {gasPrice && gasPrice.length >= 3 && (
              <div>
                <p>Low: {gasPrice[0].estimatedFee} Gwei</p>
                <p>Average: {gasPrice[1].estimatedFee} Gwei</p>
                <p>High: {gasPrice[2].estimatedFee} Gwei</p>
              </div>
            )}
            <button onClick={estimateTransactionCost}>Estimate Transaction Cost</button>
            {transactionCost && (
              <div>
                <p>Estimated Transaction Cost: ${transactionCost.toFixed(2)} USD</p>
              </div>
            )}
            <Routes>
              <Route path="/" element={<Home contract={contract} account={account} />} />
              <Route path="/create-main-agreement" element={<CreateMainAgreement contract={contract} account={account} />} />
              <Route path="/create-sub-agreement" element={<CreateSubAgreement contract={contract} account={account} />} />
              <Route path="/sign-main-agreement" element={<SignMainAgreement contract={contract} account={account} />} />
              <Route path="/sign-sub-agreement" element={<SignSubAgreement contract={contract} account={account} />} />
              <Route path="/view-main-agreement" element={<ViewMainAgreement contract={contract} account={account} />} />
              <Route path="/view-sub-agreement" element={<ViewSubAgreement contract={contract} account={account} />} />
            </Routes>
          </Layout>
        ) : (
          <Login onLogin={handleLogin} />
        )}
      </div>
    </Router>
  );
};

export default App;