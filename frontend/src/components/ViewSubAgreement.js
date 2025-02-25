import React from "react";
import SignSubAgreement from "./SignSubAgreement";

const ViewSubAgreement = ({ selectedSubAgreement, agreementId, subAgreementId, contract, account, isSubAgreementComplete }) => {
  if (!selectedSubAgreement) return null;

  return (
    <div>
      <p>Sub-Agreement Hash: {selectedSubAgreement.agreementHash}</p>
      <p>
        IPFS CID: <a href={`https://gateway.pinata.cloud/ipfs/${selectedSubAgreement.ipfsCID}`} target="_blank" rel="noopener noreferrer">{selectedSubAgreement.ipfsCID}</a>
      </p>
      <p>Sub-Vendor Address: {selectedSubAgreement.subVendor}</p>
      <p>Sub-Vendor Name: {selectedSubAgreement.subVendorName}</p>
      <p>Agreement Status: <span style={{ color: selectedSubAgreement.isComplete ? "green" : "red" }}>{selectedSubAgreement.isComplete ? "Complete✔" : "Pending❌"}</span></p>
      
      <SignSubAgreement 
        agreementId={agreementId} 
        subAgreementId={subAgreementId} 
        contract={contract} 
        account={account} 
        isSubAgreementComplete={isSubAgreementComplete} 
      />
    </div>
  );
};

export default ViewSubAgreement;