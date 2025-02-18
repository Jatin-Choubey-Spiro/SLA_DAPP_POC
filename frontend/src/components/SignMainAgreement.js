import React, { useState } from "react";
import "./Home.css";

function SignMainAgreement({ contract, account }) {
  const [signMainInput, setSignMainInput] = useState("");
  const [isAgreementComplete, setIsAgreementComplete] = useState(false);

  const checkAgreementStatus = async (agreementId) => {
    try {
      const agreement = await contract.methods.viewAgreement(agreementId).call();
      setIsAgreementComplete(agreement.isComplete);
    } catch (error) {
      console.error("Error fetching agreement status:", error);
      setIsAgreementComplete(false);
    }
  };

  const signMainAgreement = async () => {
    try {
      const mainAgreement = await contract.methods.viewAgreement(signMainInput).call();
      const subAgreementCount = mainAgreement.subAgreementCount;

      for (let i = 0; i < subAgreementCount; i++) {
        const subAgreement = await contract.methods.viewSubAgreement(signMainInput, i).call();
        if (!subAgreement.isComplete) {
          alert("Sub Agreements not completed");
          return;
        }
      }
      await contract.methods.signAgreement(signMainInput).send({ from: account });
      alert("Main agreement signed successfully.");
    } catch (error) {
      console.error("Error signing main agreement:", error);
      alert("Failed to sign main agreement. Please try again.");
    }
  };

  return (
    <div className="closeElem">
      <h2>Sign Main Agreement</h2>
      <input
        type="number"
        placeholder="Agreement ID"
        onChange={(e) => {
          const id = e.target.value;
          setSignMainInput(id);
          checkAgreementStatus(id);
        }}
      />
      <div className="btn-cont">
        <button
          onClick={signMainAgreement}
          disabled={isAgreementComplete}
          style={{
            backgroundColor: isAgreementComplete ? "grey" : "blue",
            color: isAgreementComplete ? "darkgrey" : "white",
            cursor: isAgreementComplete ? "not-allowed" : "pointer",
          }}
        >
          {isAgreementComplete ? "Agreement Complete" : "Sign Agreement"}
        </button>
      </div>
    </div>
  );
}

export default SignMainAgreement;