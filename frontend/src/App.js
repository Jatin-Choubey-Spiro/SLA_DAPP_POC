import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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

const contractAddress = "0x3152Bf2B52f871D207572A51d0763663d9034604";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [account, setAccount] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);

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
    }
  };

  return (
    <Router>
      <div>
        {isAuthenticated ? (
          <Layout account={account} connectWallet={connectWallet}>
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