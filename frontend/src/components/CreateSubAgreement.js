import React, { useState } from "react";
import FileUpload from "./FileUpload";
import "./Home.css"; // Import Home.css for styling

function CreateSubAgreement({ contract, account }) {
  const [subAgreementInput, setSubAgreementInput] = useState({
    agreementId: "",
    agreementHash: "",
    ipfsCID: "",
    subVendor: "",
    subVendorName: "",
  });

  const handleSubFileUpload = (hash, cid) => {
    setSubAgreementInput((prevState) => ({
      ...prevState,
      agreementHash: hash,
      ipfsCID: cid,
    }));
  };

  const addSubAgreement = async () => {
    const { agreementId, agreementHash, ipfsCID, subVendor, subVendorName } = subAgreementInput;
    if (!contract) {
      console.error("Contract is not defined");
      return;
    }
    try {
        await contract.methods.createSubAgreement(agreementId, agreementHash, ipfsCID, subVendor, subVendorName).send({ from: account });
        alert("Sub-agreement added successfully.");
      } catch (error) {
        console.error("Error adding sub-agreement:", error);
      }
    };
  
    return (
      <div>
        <h2>Add Sub-Agreement</h2>
        <input
          type="number"
          placeholder="Agreement ID"
          onChange={(e) =>
            setSubAgreementInput({ ...subAgreementInput, agreementId: e.target.value })
          }
        />
        <FileUpload onFileUpload={handleSubFileUpload} />
        <input
          type="text"
          placeholder="Sub-Vendor Address"
          onChange={(e) =>
            setSubAgreementInput({ ...subAgreementInput, subVendor: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Sub-Vendor Name"
          onChange={(e) =>
            setSubAgreementInput({ ...subAgreementInput, subVendorName: e.target.value })
          }
        />
        <button onClick={addSubAgreement}>Add Sub-Agreement</button>
      </div>
    );
  }
  
  export default CreateSubAgreement;