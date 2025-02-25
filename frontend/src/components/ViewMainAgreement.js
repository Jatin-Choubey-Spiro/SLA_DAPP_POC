import React from "react";
import SignMainAgreement from "./SignMainAgreement";
import "./Home.css";

const ViewMainAgreement = ({ selectedAgreement, agreementId, contract, account, isAgreementComplete }) => {
  if (!selectedAgreement) return null;

  return (
    <div className="agreement-details">
      <p><strong>Agreement Hash:</strong> {selectedAgreement.agreementHash}</p>
      <p>
        <strong>IPFS CID:</strong> 
        <a href={`https://gateway.pinata.cloud/ipfs/${selectedAgreement.ipfsCID}`} target="_blank" rel="noopener noreferrer">
          {selectedAgreement.ipfsCID}
        </a>
      </p>
      <p><strong>Vendor Address:</strong> {selectedAgreement.vendor}</p>
      <p><strong>Vendor Name:</strong> {selectedAgreement.vendorName}</p>
      <p>
        <strong>Agreement Status:</strong> 
        <span style={{ color: selectedAgreement.isComplete ? "green" : "red" }}>
          {selectedAgreement.isComplete ? "Complete✔" : "Pending❌"}
        </span>
      </p>
      
      <SignMainAgreement 
        agreementId={agreementId} 
        contract={contract} 
        account={account} 
        isAgreementComplete={isAgreementComplete} 
      />
    </div>
  );
};

export default ViewMainAgreement;