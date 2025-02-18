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
import Layout from "./components/Layout";
import Web3 from "web3";
import SpiroAgreementManager from "./build/contracts/SpiroAgreementManager.json";

import spiro from "./pics/spiro.png";   // Importing images
import rapido from "./pics/rapido.png"; 
import Slide1 from "./Guide/Slide1.PNG";
import Slide2 from "./Guide/Slide2.PNG";
import Slide3 from "./Guide/Slide3.PNG";
import Slide4 from "./Guide/Slide4.PNG";
import Slide5 from "./Guide/Slide5.PNG";

const contractAddress = "0x0b655A7bEf2bE45D8D59a7d593Dc970172239296";
const apiKey = "58cbbf110630457787d8a099f8b70b06";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [account, setAccount] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [gasPrice, setGasPrice] = useState(null);
  const [ethPrice, setEthPrice] = useState(null);
  const [transactionCost, setTransactionCost] = useState(null);
  const [showPreview, setShowPreview] = useState(false); // Preview state

  const handleLogin = () => {
    setIsAuthenticated(true);
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
      <div style={{ position: "relative", minHeight: "100vh" }}>
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

        <button
          onClick={() => setShowPreview(true)}
          style={{
            position: "fixed",
            bottom: "15px",
            left: "15px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "10%",
            width: "120px",
            height: "60px",
            fontSize: "15px",
            cursor: "pointer",
            boxShadow: "0px 2px 5px rgba(0,0,0,0.3)"
          }}
        >
          About Platform🔍
        </button>

        {showPreview && (
  <div
    style={{
      position: "fixed",
      top: "10%",
      left: "10%",
      width: "80vw",
      height: "80vh",
      background: "white",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
      zIndex: 1000,
      overflowY: "auto"
    }}
  >
    <button
  onClick={() => setShowPreview(false)}
  style={{
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "red",
    color: "white",
    border: "none",
    borderRadius: "50%",
    width: "30px",
    height: "30px",
    fontSize: "16px",
    cursor: "pointer"
  }}
>
  X
</button>
    <br></br>
    <h1><strong>ContractZ</strong> by Spiro</h1>
    <p style={{ fontSize: "16px", fontWeight: "bold", textAlign: "center" }}>
      Welcome to ContractZ, a blockchain-powered digital agreement platform designed for secure, transparent, and automated contract management. Unlike traditional signing platforms, ContractZ ensures tamper-proof agreements and enforces hierarchical signing workflows. <br /><br />
      
      <strong>How It Works</strong><br />
      <strong>1. Agreement Creation:</strong><br />
      • Spiro EV (Owner) uploads an agreement for a Level 1 vendor.<br />
      • The document is hashed (SHA-256) and stored on IPFS for security.<br />
      • IPFS CID, hash, and vendor details are recorded on the blockchain.<br /><br />

      <strong>2. Multi-Level Hierarchy:</strong><br />
      • Vendors can add sub-vendors, creating structured, tree-like agreements.<br />
      • Agreements must be signed in order—sub-vendors first, then vendors, and finally, Spiro.<br /><br />

      <strong>3. Blockchain-Powered Transparency:</strong><br />
      • Every action is recorded on the Ethereum blockchain, ensuring full auditability.<br />
      • IPFS storage + SHA-256 hashing provides dual-layer transparency for document verification.<br /><br />

      <strong>4. Real-Time Visual Representation:</strong><br />
      • Agreements are displayed in a tree format, making tracking easy and intuitive.<br /><br />

      <strong>Why ContractZ?</strong><br />
      ✅ Tamper-Proof & Immutable Agreements<br />
      ✅ Clear, Visual Hierarchical Structure<br />
      ✅ Automated, Role-Based Signing Workflow<br />
      ✅ Full Transparency & Blockchain Verification<br /><br />

      ContractZ simplifies digital contract management, ensuring security, compliance, and trust in every agreement. 🚀
    </p>

    
    <div style={{ display: "flex", flexDirection: "column", gap: "5px", alignItems: "center" }}>
      <img src={Slide1} alt="Slide1" style={{ width: "1200px", height: "auto", borderRadius: "5px", padding: "20px" }} />
      <br></br>
      <img src={Slide2} alt="Slide2" style={{ width: "1200px", height: "auto", borderRadius: "5px", padding: "20px" }} />
      <br></br>
      <img src={Slide3} alt="Slide3" style={{ width: "1200px", height: "auto", borderRadius: "5px", padding: "20px" }} />
      <br></br>
      <img src={Slide4} alt="Slide4" style={{ width: "1200px", height: "auto", borderRadius: "5px", padding: "20px" }} />
      <br></br>
      <img src={Slide5} alt="Slide5" style={{ width: "1200px", height: "auto", borderRadius: "5px", padding: "20px" }} />
    </div>
  </div>
)}
      </div>
    </Router>
  );
};

export default App;
