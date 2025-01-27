import React, { useState } from "react";
import "./Home.css";

function ViewSubAgreement({ contract, account }) {
  const [viewSubInput, setViewSubInput] = useState({
    agreementId: "",
    subAgreementId: "",
  });
  const [subAgreementDetails, setSubAgreementDetails] = useState(null);

  const viewSubAgreement = async () => {
    const { agreementId, subAgreementId } = viewSubInput;
    try {
      const subAgreement = await contract.methods.viewSubAgreement(agreementId, subAgreementId).call({ from: account });
      setSubAgreementDetails(subAgreement);
    } catch (error) {
      console.error("Error viewing sub-agreement:", error);
    }
  };

  return (
    <div>
      <h2>View Sub-Agreement</h2>
      <input
        type="number"
        placeholder="Agreement ID"
        onChange={(e) =>
          setViewSubInput({ ...viewSubInput, agreementId: e.target.value })
        }
      />
      <input
        type="number"
        placeholder="Sub-Agreement ID"
        onChange={(e) =>
          setViewSubInput({ ...viewSubInput, subAgreementId: e.target.value })
        }
      />
      <button onClick={viewSubAgreement}>View Sub-Agreement</button>
      {subAgreementDetails && (
        <div className="agreement-details">
          <p>Sub-Agreement Hash: {subAgreementDetails.agreementHash}</p>
          <p>IPFS CID: {subAgreementDetails.ipfsCID}</p>
          <p>Address: {subAgreementDetails.subVendor}</p>
          <p>Name: {subAgreementDetails.subVendorName}</p>
          <p>Is Complete: {subAgreementDetails.isComplete.toString()}</p>
        </div>
      )}
    </div>
  );
}

export default ViewSubAgreement;