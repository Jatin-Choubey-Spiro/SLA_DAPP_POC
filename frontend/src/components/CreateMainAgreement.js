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
    if (!agreementHash || !ipfsCID) {
      alert("Please provide hash and IPFS CID");
      return;
    }
    try {
      await contract.methods.createAgreement(agreementHash, ipfsCID, vendor, vendorName).send({ from: account });
      alert("Main agreement added successfully.");
    } catch (error) {
      console.error("Error adding main agreement:", error);
    }
  };

  return (
    <div>
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
          setMainAgreementInput({ ...mainAgreementInput, vendorName: e.target.value})
        }
      
      />
      <button onClick={addMainAgreement}>Add Main Agreement</button>
    </div>
  );
}

export default CreateMainAgreement;
