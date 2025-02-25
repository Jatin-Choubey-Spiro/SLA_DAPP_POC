import React from "react";

const SignMainAgreement = ({ agreementId, contract, account, isAgreementComplete }) => {
  const signMainAgreement = async () => {
    try {
      const mainAgreement = await contract.methods.viewAgreement(agreementId).call();
      const subAgreementCount = mainAgreement.subAgreementCount;

      for (let i = 0; i < subAgreementCount; i++) {
        const subAgreement = await contract.methods.viewSubAgreement(agreementId, i).call();
        if (!subAgreement.isComplete) {
          alert("Sub Agreements not completed");
          return;
        }
      }
      await contract.methods.signAgreement(agreementId).send({ from: account });
      alert("Main agreement signed successfully.");
    } catch (error) {
      console.error("Error signing main agreement:", error);
      alert("Failed to sign main agreement. Please try again.");
    }
  };

  return (
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
  );
};

export default SignMainAgreement;