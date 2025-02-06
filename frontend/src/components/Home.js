import React, { useState, useEffect } from "react";
import Web3 from "web3";
import "./Home.css"; // Import Home.css for styling

const contractAddress = "0x0b03DDBDcaF0F5446711aBA02919f6a304c664a5";

function Home({ contract, account }) {
  const [hierarchy, setHierarchy] = useState({});
  const [owner, setOwner] = useState(null);

  useEffect(() => {
    if (contract) {
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

  useEffect(() => {
    if (contract) {
      fetchOwner();
    }
  }, [contract]);

  const fetchHierarchy = async (contractInstance) => {
    if (!contractInstance) return;

    const hierarchyData = {};
    try {
      const agreementCount = await contractInstance.methods.agreementCount().call();

      for (let i = 0; i < agreementCount; i++) {
        const agreement = await contractInstance.methods.viewAgreement(i).call();
        const vendorName = agreement.vendorName; // Fetch vendorName
        if (!hierarchyData[vendorName]) {
          hierarchyData[vendorName] = { isComplete: agreement.isComplete, subVendors: [] };
        }
        for (let j = 0; j < agreement.subAgreementCount; j++) {
          const subAgreement = await contractInstance.methods.viewSubAgreement(i, j).call();
          const subVendorName = subAgreement.subVendorName; // Fetch subVendorName
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

  const renderHierarchy = (hierarchy) => {
    return (
      <ul className="hierarchy">
        {Object.keys(hierarchy).map((vendorName, vendorIndex) => (
          <li key={vendorName}>
            <h3
              className="vendor"
              style={{
                color: hierarchy[vendorName].isComplete ? "green" : "red",
              }}
            >
              {vendorIndex}. Vendor: {vendorName}
            </h3>
            {hierarchy[vendorName].subVendors.length > 0 && (
              <ul className="sub-vendors">
                {hierarchy[vendorName].subVendors.map((subVendor, subVendorIndex) => (
                  <li
                    key={`${vendorName}-${subVendorIndex}`}
                    className="sub-vendor"
                    style={{
                      color: subVendor.isComplete ? "green" : "red",
                    }}
                  >
                    {vendorIndex}.{subVendorIndex} SubVendor: {subVendor.name}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="hierarchy-container">
      <h2>Owner: {owner}</h2>
      {renderHierarchy(hierarchy)}
    </div>
  );
}

export default Home;
