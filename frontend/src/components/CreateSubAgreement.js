import React, { useState } from "react";
import FileUpload from "./FileUpload";
import "./Home.css"; // Import Home.css for styling

function CreateSubAgreement({ contract, account }) {
  const [subAgreementInput, setSubAgreementInput] = useState({
    agreementId: "",
    agreementHash: "",
    ipfsCID: "",
    owningVendor: account, // Spiro as owner
    owningVendorName: "Spiro EV",
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
    const { agreementId, agreementHash, ipfsCID, owningVendor, owningVendorName, subVendor, subVendorName } = subAgreementInput;
    
    if (!contract) {
      console.error("Contract is not defined");
      return;
    }

    try {
      // Call Smart Contract
      const tx = await contract.methods.createSubAgreement(agreementId, agreementHash, ipfsCID, subVendor, subVendorName).send({ from: account });
      const transactionHash = tx.transactionHash;

      // Store in PostgreSQL
      const response = await fetch("http://localhost:5000/sub-agreements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          owning_vendor_name: owningVendorName,
          owning_vendor_address: owningVendor,
          sub_vendor_name: subVendorName,
          sub_vendor_address: subVendor,
          ipfsCID,
          agreementHash,
          transactionHash,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Sub-agreement stored:", data);
      alert("Sub-agreement added successfully.");

    } catch (error) {
      console.error("Error adding sub-agreement:", error);
    }
  };

  return (
    <div className="closeElem">
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
      <div className="btn-cont">
        <button onClick={addSubAgreement}>Add Sub-Agreement</button>
      </div>
    </div>
  );
}

export default CreateSubAgreement;
