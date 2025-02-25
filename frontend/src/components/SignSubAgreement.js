import React from "react";

const SignSubAgreement = ({ agreementId, subAgreementId, contract, account, isSubAgreementComplete }) => {
  const signSubAgreement = async () => {
    try {
      await contract.methods.signSubAgreement(agreementId, subAgreementId).send({ from: account });
      alert("Sub-agreement signed successfully!");
    } catch (error) {
      console.error("Error signing sub-agreement:", error);
      alert("Failed to sign the sub-agreement. Please try again.");
    }
  };

  return (
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
  );
};

export default SignSubAgreement;