import React from "react";
import { Link } from "react-router-dom";
import "./Layout.css"; // Import Layout.css for styling
import homeIcon from "./logos/image.png"; // Import the image
import contractZ from "./logos/contractZ.png";

const Layout = ({ account, connectWallet, children }) => {
  return (
    <div className="main-layout">
      <div className="ribbon">
        <Link to="/">
          <img src={homeIcon} alt="Home" className="home-icon" />
        </Link>
        <Link to="/create-main-agreement">Create Main Agreement</Link>
        <Link to="/create-sub-agreement">Create Sub Agreement</Link>
      </div>
      <div className="main-content">
        <h1>
          <img src={contractZ} alt="Spiro Agreement Manager" className="contract-logo" />
        </h1>
        <div className="connect-wallet">
          {!account && (
            <button onClick={connectWallet} className="connect-button">
              Connect Web3 <span className="status-bulb red"></span>
            </button>
          )}
        </div>
        {account && (
          <p className="connected-status">
            Connected : {account} <span className="status-bulb green"></span>
          </p>
        )}
        {children}
      </div>
    </div>
  );
};

export default Layout;
