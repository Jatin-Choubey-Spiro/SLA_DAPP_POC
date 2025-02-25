import React, { useState, useEffect } from "react";
import FileUpload from "./FileUpload";
import "./Home.css"; // Import Home.css for styling

function CreateSubAgreement({ contract, account }) {
  const [subAgreementInput, setSubAgreementInput] = useState({
    agreementHash: "",
    ipfsCID: "",
    subVendor: "",
    subVendorName: "",
  });

  const [vendorAgreementId, setVendorAgreementId] = useState(null);

  // Fetch Vendor Agreement ID based on connected account
  useEffect(() => {
    const fetchVendorAgreementId = async () => {
      if (!contract || !account) return;
  
      try {
        const agreementCount = await contract.methods.agreementCount().call();
  
        for (let i = 0; i < agreementCount; i++) {
          const agreement = await contract.methods.viewAgreement(i).call();
          if (agreement.vendor.toLowerCase() === account.toLowerCase()) {
            setVendorAgreementId(i);
            setSubAgreementInput((prevState) => ({
              ...prevState,
              owningVendorName: agreement.vendorName, // Fetch vendor name
            }));
            return;
          }
        }
        console.error("No agreement found for this vendor");
      } catch (error) {
        console.error("Error fetching vendor agreement ID:", error);
      }
    };
  
    fetchVendorAgreementId();
  }, [contract, account]);
  

  const handleSubFileUpload = (hash, cid) => {
    setSubAgreementInput((prevState) => ({
      ...prevState,
      agreementHash: hash,
      ipfsCID: cid,
    }));
  };

  const addSubAgreement = async () => {
    if (!contract) {
      console.error("Contract is not defined");
      return;
    }

    if (vendorAgreementId === null) {
      alert("Error: No agreement found for this vendor.");
      return;
    }

    const { agreementHash, ipfsCID, subVendor, subVendorName, owningVendorName } = subAgreementInput;

    try {
      // Call Smart Contract with the fetched `vendorAgreementId`
      const tx = await contract.methods.createSubAgreement(vendorAgreementId, agreementHash, ipfsCID, subVendor, subVendorName).send({ from: account });
      const transactionHash = tx.transactionHash;

      // Store in PostgreSQL
      const response = await fetch("http://localhost:5000/sub-agreements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          owning_vendor_name: owningVendorName, // Now correctly populated
          owning_vendor_address: account,
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
