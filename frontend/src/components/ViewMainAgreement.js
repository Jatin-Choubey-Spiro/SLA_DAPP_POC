import React, { useState } from "react";
import "./Home.css";

function ViewMainAgreement({ contract, account }) {
  const [viewMainInput, setViewMainInput] = useState("");
  const [agreementDetails, setAgreementDetails] = useState(null);

  const viewMainAgreement = async () => {
    try {
      const agreement = await contract.methods.viewAgreement(viewMainInput).call({ from: account });
      setAgreementDetails(agreement);
    } catch (error) {
      console.error("Error viewing main agreement:", error);
    }
  };

  return (
    <div className="closeElem">
      <h2>View Main Agreement</h2>
      <input
        type="number"
        placeholder="Agreement ID"
        onChange={(e) => setViewMainInput(e.target.value)}
      />
      <div className="btn-cont">
        <button onClick={viewMainAgreement}>View Main Agreement</button>
      </div>
      {agreementDetails && (
        <div className="agreement-details">
          <p>Agreement Hash: {agreementDetails.agreementHash}</p>
          <p>IPFS CID: {agreementDetails.ipfsCID}</p>
          <p>Address: {agreementDetails.vendor}</p>
          <p>Name: {agreementDetails.vendorName}</p>
          <p>Agreement Status: <span style={{ color: agreementDetails.isComplete.toString() === "false" ? "red" : "green" }}>
                {agreementDetails.isComplete.toString() === "false" ? "Pending" : "Complete"}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}

export default ViewMainAgreement;