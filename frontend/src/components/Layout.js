import React from "react";
import { Link } from "react-router-dom";
import "./Home.css"; // Import Home.css for styling
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
        <Link to="/sign-main-agreement">Sign Main Agreement</Link>
        <Link to="/sign-sub-agreement">Sign Sub Agreement</Link>
        {/* <Link to="/view-main-agreement">View Main Agreement</Link>
        <Link to="/view-sub-agreement">View Sub Agreement</Link> */}
      </div>
      <div className="main-content">
      <h1>
      <img src={contractZ} alt="Spiro Agreement Manager" style={{ height: "80px", padding: "20px"}} />
    </h1>
        <div className="connect-wallet">
          {!account && <button onClick={connectWallet}>Connect Wallet</button>}
        </div>
        {account && (
          <p
            style={{
              backgroundColor: "blue",
              color: "yellow",
              padding: "10px",
              borderRadius: "5px",
              textAlign: "center",
            }}
          >
            Connected Account :: {account}
          </p>
        )}
        {children}
      </div>
    </div>
  );
};

export default Layout;