import React, { useState, useEffect } from "react";
import "./Home.css";
import "bootstrap/dist/css/bootstrap.min.css";

function Home({ contract }) {
  const [hierarchy, setHierarchy] = useState({});
  const [owner, setOwner] = useState(null);

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
          hierarchyData[vendorName] = { isComplete: agreement.isComplete, subVendors: [] };
        }
        for (let j = 0; j < agreement.subAgreementCount; j++) {
          const subAgreement = await contractInstance.methods.viewSubAgreement(i, j).call();
          const subVendorName = subAgreement.subVendorName;
          hierarchyData[vendorName].subVendors.push({
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
  return (
    <div className="container mt-4">
      {/* Owner at the top (Not in grid) */}
      <h2>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>Owner:</strong> {owner} <strong>(Spiro EV)</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</h2>
      {/* Vendors & SubVendors below */}
      <div className="row">
        {Object.keys(hierarchy).map((vendorName, vendorIndex) => (
          <div key={vendorName} className="col-12 mb-3">
            <div className="card vendor-card">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">
                  {vendorIndex}. &nbsp; {vendorName}{" "}
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
                        className={`list-group-item d-flex justify-content-between align-items-center`}
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
    </div>
  );
}

export default Home;