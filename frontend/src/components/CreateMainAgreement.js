import React, { useState } from "react";
import FileUpload from "./FileUpload";
import "./Home.css";

function CreateMainAgreement({ contract, account }) {
  const [mainAgreementInput, setMainAgreementInput] = useState({
    agreementHash: "",
    ipfsCID: "",
    vendor: "",
    vendorName: "",
  });

  const handleMainFileUpload = (hash, cid) => {
    setMainAgreementInput((prevState) => ({
      ...prevState,
      agreementHash: hash,
      ipfsCID: cid,
    }));
  };

  const addMainAgreement = async () => {
    const { agreementHash, ipfsCID, vendor, vendorName } = mainAgreementInput;
    if (!agreementHash || !ipfsCID || !vendor || !vendorName) {
      alert("Please provide all fields");
      return;
    }

    try {
      // Interact with Solidity Smart Contract
      const tx = await contract.methods
        .createAgreement(agreementHash, ipfsCID, vendor, vendorName)
        .send({ from: account });

      const transactionHash = tx.transactionHash; // Get blockchain transaction hash

      // Send agreement details to the backend
      const response = await fetch("http://localhost:5000/agreements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agreementHash,
          ipfsCID,
          vendor,
          vendorName,
          transactionHash,
        }),
      });

      if (response.ok) {
        alert("Main agreement added successfully.");
      } else {
        alert("Failed to store in database.");
      }
    } catch (error) {
      console.error("Error adding main agreement:", error);
    }
  };

  return (
    <div className="closeElem">
      <h2>Add Main Agreement</h2>
      <FileUpload onFileUpload={handleMainFileUpload} />
      <input
        type="text"
        placeholder="Vendor Address"
        onChange={(e) =>
          setMainAgreementInput({ ...mainAgreementInput, vendor: e.target.value })
        }
      />
      <input
        type="text"
        placeholder="Vendor Name"
        onChange={(e) =>
          setMainAgreementInput({ ...mainAgreementInput, vendorName: e.target.value })
        }
      />
      <div className="btn-cont">
        <button onClick={addMainAgreement}>Add Main Agreement</button>
      </div>
    </div>
  );
}

export default CreateMainAgreement;
