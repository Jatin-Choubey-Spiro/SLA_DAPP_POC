import React, { useState, useEffect } from "react";
import "./Home.css";
import "bootstrap/dist/css/bootstrap.min.css";
import ViewMainAgreement from "./ViewMainAgreement";
import ViewSubAgreement from "./ViewSubAgreement";
import ContextMenu from "./ContextMenu"; // Import the ContextMenu component

function Home({ contract, account }) {
  const [hierarchy, setHierarchy] = useState({});
  const [owner, setOwner] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [selectedSubVendor, setSelectedSubVendor] = useState(null);
  const [selectedAgreement, setSelectedAgreement] = useState(null);
  const [selectedSubAgreement, setSelectedSubAgreement] = useState(null);
  const [isAgreementComplete, setIsAgreementComplete] = useState(false);
  const [isSubAgreementComplete, setIsSubAgreementComplete] = useState(false);
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, content: null });

  useEffect(() => {
    if (contract) {
      fetchOwner();
      fetchHierarchy(contract);
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

  const toggleAgreementView = async (vendorName, agreementId, event) => {
    event.preventDefault();
    const agreement = await contract.methods.viewAgreement(agreementId).call();
    setSelectedVendor(vendorName);
    setSelectedAgreement(agreement);
    setSelectedSubVendor(null);
    setSelectedSubAgreement(null);
    setIsAgreementComplete(agreement.isComplete);
    setContextMenu({
      visible: true,
      x: event.clientX,
      y: event.clientY,
      content: <ViewMainAgreement selectedAgreement={agreement} agreementId={agreementId} contract={contract} account={account} isAgreementComplete={agreement.isComplete} />
    });
  };

  const toggleSubAgreementView = async (subVendorName, agreementId, subAgreementId, event) => {
    event.preventDefault();
    const subAgreement = await contract.methods.viewSubAgreement(agreementId, subAgreementId).call();
    setSelectedSubVendor(subVendorName);
    setSelectedSubAgreement(subAgreement);
    setIsSubAgreementComplete(subAgreement.isComplete);
    setContextMenu({
      visible: true,
      x: event.clientX,
      y: event.clientY,
      content: <ViewSubAgreement selectedSubAgreement={subAgreement} agreementId={agreementId} subAgreementId={subAgreementId} contract={contract} account={account} isSubAgreementComplete={subAgreement.isComplete} />
    });
  };

  const handleContextMenuClose = () => {
    setContextMenu({ visible: false, x: 0, y: 0, content: null });
  };

  return (
    <div className="container mt-4" onClick={handleContextMenuClose}>
      <h2><strong>Owner:</strong> {owner} <strong>(Spiro EV)</strong></h2>

      <div className="row">
        {Object.keys(hierarchy).map((vendorName, vendorIndex) => (
          <div key={vendorName} className="col-md-4 mb-3">
            <div className="card">
              {/* Main Agreement Header */}
              <div
                className="card-header bg-primary text-white d-flex justify-content-between align-items-center"
                onClick={(event) => toggleAgreementView(vendorName, hierarchy[vendorName].id, event)}
                style={{ cursor: "pointer" }}
              >
                <h5>{vendorIndex + 1}. {vendorName}</h5>
                <span className={`badge ${hierarchy[vendorName].isComplete ? "bg-success" : "bg-danger"}`}>
                  {hierarchy[vendorName].isComplete ? "Complete✔" : "Pending❌"}
                </span>
              </div>

              {/* Sub-Agreements */}
              <div className="card-body">
                {hierarchy[vendorName].subVendors.map((subVendor, subVendorIndex) => (
                  <div key={`${vendorName}-${subVendorIndex}`} onClick={(event) => toggleSubAgreementView(subVendor.name, subVendor.agreementId, subVendor.id, event)} className="list-group-item" style={{ cursor: "pointer" }}>
                    {vendorIndex + 1}.{subVendorIndex + 1} &nbsp; {subVendor.name}&nbsp;&nbsp;
                    <span className={`badge ${subVendor.isComplete ? "bg-success" : "bg-danger"}`}>
                      {subVendor.isComplete ? "Complete✔" : "Pending❌"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {contextMenu.visible && (
        <ContextMenu x={contextMenu.x} y={contextMenu.y} content={contextMenu.content} />
      )}
    </div>
  );
}

export default Home;