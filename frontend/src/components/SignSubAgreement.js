import React, { useState } from "react";
import "./Home.css";

function SignSubAgreement({ contract, account }) {
  const [agreementIdForSub, setAgreementIdForSub] = useState("");
  const [subAgreementId, setSubAgreementId] = useState("");
  const [isSubAgreementComplete, setIsSubAgreementComplete] = useState(false);

  const checkSubAgreementStatus = async (agreementId, subAgreementId) => {
    try {
      const subAgreement = await contract.methods
        .viewSubAgreement(agreementId, subAgreementId)
        .call();
      setIsSubAgreementComplete(subAgreement.isComplete);
    } catch (error) {
      console.error("Error fetching sub-agreement status:", error);
      setIsSubAgreementComplete(false);
    }
  };

  const signSubAgreement = async () => {
    try {
      await contract.methods
        .signSubAgreement(agreementIdForSub, subAgreementId)
        .send({ from: account });
      alert("Sub-agreement signed successfully!");
      setSubAgreementId("");
      setAgreementIdForSub("");
      setIsSubAgreementComplete(true);
    } catch (error) {
      console.error("Error signing sub-agreement:", error);
      alert("Failed to sign the sub-agreement. Please try again.");
    }
  };

  return (
    <div className="closeElem">
      <h2>Sign Sub Agreement</h2>
      <input
        type="number"
        placeholder="Agreement ID"
        value={agreementIdForSub}
        onChange={(e) => {
          const agreementId = e.target.value;
          setAgreementIdForSub(agreementId);
          if (agreementId && subAgreementId) {
            checkSubAgreementStatus(agreementId, subAgreementId);
          }
        }}
      />
      <input
        type="number"
        placeholder="Sub Agreement ID"
        value={subAgreementId}
        onChange={(e) => {
          const subId = e.target.value;
          setSubAgreementId(subId);
          if (agreementIdForSub && subId) {
            checkSubAgreementStatus(agreementIdForSub, subId);
          }
        }}
      />
      <div className="btn-cont">
        <button
          onClick={signSubAgreement}
          disabled={isSubAgreementComplete}
          style={{
            backgroundColor: isSubAgreementComplete ? "grey" : "blue",
            color: isSubAgreementComplete ? "darkgrey" : "white",
            cursor: isSubAgreementComplete ? "not-allowed" : "pointer",
          }}
        >
          {isSubAgreementComplete ? "Sub Agreement Complete" : "Sign Sub Agreement"}
        </button>
      </div>
    </div>
  );
}

export default SignSubAgreement;