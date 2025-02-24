import React, { useState, useEffect } from "react";
import "./Home.css";
import "bootstrap/dist/css/bootstrap.min.css";

function Home({ contract, account }) {
  const [hierarchy, setHierarchy] = useState({});
  const [owner, setOwner] = useState(null);
  const [selectedAgreement, setSelectedAgreement] = useState(null);
  const [selectedSubAgreement, setSelectedSubAgreement] = useState(null);

  useEffect(() => {
    if (contract) {
      fetchHierarchy(contract);
      fetchOwner();
    }
  }, [contract]);

  const fetchOwner = async () => {
    if (contract) {
      try {
        const ownerAddress = await contract.methods.owner().call();
        setOwner(ownerAddress);
      } catch (error) {
        console.error("Error fetching owner address:", error);
      }
    }
  };

  const fetchHierarchy = async (contractInstance) => {
    if (!contractInstance) return;

    const hierarchyData = {};
    try {
      const agreementCount = await contractInstance.methods.agreementCount().call();
      for (let i = 0; i < agreementCount; i++) {
        const agreement = await contractInstance.methods.viewAgreement(i).call();
        const vendorName = agreement.vendorName;
        if (!hierarchyData[vendorName]) {
          hierarchyData[vendorName] = { id: i, isComplete: agreement.isComplete, subVendors: [] };
        }
        for (let j = 0; j < agreement.subAgreementCount; j++) {
          const subAgreement = await contractInstance.methods.viewSubAgreement(i, j).call();
          const subVendorName = subAgreement.subVendorName;
          hierarchyData[vendorName].subVendors.push({
            id: j,
            agreementId: i,
            name: subVendorName,
            isComplete: subAgreement.isComplete,
          });
        }
      }
      setHierarchy(hierarchyData);
    } catch (error) {
      console.error("Error fetching hierarchy:", error);
    }
  };

  const viewAgreement = async (agreementId) => {
    try {
      const agreement = await contract.methods.viewAgreement(agreementId).call({ from: account });
      setSelectedAgreement(agreement);
      setSelectedSubAgreement(null);
    } catch (error) {
      console.error("Error viewing main agreement:", error);
    }
  };

  const viewSubAgreement = async (agreementId, subAgreementId) => {
    try {
      const subAgreement = await contract.methods.viewSubAgreement(agreementId, subAgreementId).call({ from: account });
      setSelectedSubAgreement(subAgreement);
      setSelectedAgreement(null);
    } catch (error) {
      console.error("Error viewing sub-agreement:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>Owner:</strong> {owner} <strong>(Spiro EV)</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</h2>
      <div className="row">
        {Object.keys(hierarchy).map((vendorName, vendorIndex) => (
          <div key={vendorName} className="col-12 mb-3">
            <div className="card vendor-card">
              <div className="card-header bg-primary text-white" onClick={() => viewAgreement(hierarchy[vendorName].id)} style={{ cursor: "pointer" }}>
                <h5 className="mb-0">
                  {vendorIndex}. &nbsp; {vendorName} {" "}
                  <span className={`badge ${hierarchy[vendorName].isComplete ? "bg-success" : "bg-danger"}`}>
                    {hierarchy[vendorName].isComplete ? "Complete" : "Pending"}
                  </span>
                </h5>
              </div>
              <div className="card-body">
                {hierarchy[vendorName].subVendors.length > 0 ? (
                  <ul className="list-group">
                    {hierarchy[vendorName].subVendors.map((subVendor, subVendorIndex) => (
                      <li
                        key={`${vendorName}-${subVendorIndex}`}
                        className="list-group-item d-flex justify-content-between align-items-center"
                        onClick={() => viewSubAgreement(subVendor.agreementId, subVendor.id)}
                        style={{ cursor: "pointer" }}
                      >
                        {vendorIndex}.{subVendorIndex} &nbsp; {subVendor.name}
                        <span className={`badge ${subVendor.isComplete ? "bg-success" : "bg-danger"}`}>
                          {subVendor.isComplete ? "Complete" : "Pending"}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted">No sub-vendors</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {selectedAgreement && (
        <div className="agreement-details mt-4">
          <h2>Agreement Details</h2>
          <p>Agreement Hash: {selectedAgreement.agreementHash}</p>
          <p>
            IPFS CID: <a href={`https://gateway.pinata.cloud/ipfs/${selectedAgreement.ipfsCID}`} target="_blank" rel="noopener noreferrer">{selectedAgreement.ipfsCID}</a>
          </p>
          <p>Vendor Address: {selectedAgreement.vendor}</p>
          <p>Vendor Name: {selectedAgreement.vendorName}</p>
          <p>Agreement Status: <span style={{ color: selectedAgreement.isComplete ? "green" : "red" }}>{selectedAgreement.isComplete ? "Complete" : "Pending"}</span></p>
        </div>
      )}
      {selectedSubAgreement && (
        <div className="agreement-details mt-4">
          <h2><strong>Sub-Agreement Details</strong></h2>
          <p><strong>Sub-Agreement Hash:</strong> {selectedSubAgreement.agreementHash}</p>
          <p>
            <strong>IPFS CID:</strong> <a href={`https://gateway.pinata.cloud/ipfs/${selectedSubAgreement.ipfsCID}`} target="_blank" rel="noopener noreferrer">{selectedSubAgreement.ipfsCID}</a>
          </p>
          <p><strong>Sub-Vendor Address: </strong>{selectedSubAgreement.subVendor}</p>
          <p><strong>Sub-Vendor Name: </strong>{selectedSubAgreement.subVendorName}</p>
          <p><strong>Agreement Status: </strong><span style={{ color: selectedSubAgreement.isComplete ? "green" : "red" }}>{selectedSubAgreement.isComplete ? "Complete" : "Pending"}</span></p>
        </div>
      )}
    </div>
  );
}

export default Home;
