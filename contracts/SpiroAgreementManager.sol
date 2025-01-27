// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SpiroAgreementManager {
    struct SubAgreement {
        string agreementHash;
        string ipfsCID;
        address subVendor;
        string subVendorName; // Added sub-vendor name
        bool isComplete;
        mapping(address => bool) hasSigned;
    }

    struct Agreement {
        string agreementHash;
        string ipfsCID;
        address vendor;
        string vendorName; // Added vendor name
        bool isComplete;
        mapping(address => bool) hasSigned;
        uint256 subAgreementCount;
        mapping(uint256 => SubAgreement) subAgreements;
    }

    address public owner;
    mapping(uint256 => Agreement) private agreements;
    uint256 public agreementCount;

    event AgreementCreated(uint256 agreementId, address vendor, string vendorName, string ipfsCID, string agreementHash);
    event SubAgreementCreated(uint256 agreementId, uint256 subAgreementId, address subVendor, string subVendorName, string ipfsCID, string agreementHash);
    event AgreementSigned(uint256 agreementId, address signer);
    event SubAgreementSigned(uint256 agreementId, uint256 subAgreementId, address signer);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function createAgreement(
        string calldata _agreementHash,
        string calldata _ipfsCID,
        address _vendor,
        string calldata _vendorName
    ) external onlyOwner {
        require(_vendor != address(0), "Vendor address cannot be zero");

        uint256 agreementId = agreementCount;
        Agreement storage agreement = agreements[agreementId];
        agreement.agreementHash = _agreementHash;
        agreement.ipfsCID = _ipfsCID;
        agreement.vendor = _vendor;
        agreement.vendorName = _vendorName;
        agreement.isComplete = false;
        agreement.hasSigned[owner] = false;
        agreement.hasSigned[_vendor] = false;

        agreementCount++;
        emit AgreementCreated(agreementId, _vendor, _vendorName, _ipfsCID, _agreementHash);
    }

    event SubAgreementCreated(uint256 agreementId, uint256 subAgreementId, address subVendor, string subVendorName);

    function createSubAgreement(
        uint256 _agreementId,
        string calldata _agreementHash,
        string calldata _ipfsCID,
        address _subVendor,
        string calldata _subVendorName
    ) external {
        Agreement storage agreement = agreements[_agreementId];
        require(msg.sender == agreement.vendor, "Only the authorized vendor can add sub-vendors");
        require(!agreement.isComplete, "Main agreement is already complete");
        require(_subVendor != address(0), "Sub-vendor address cannot be zero");

        uint256 subAgreementId = agreement.subAgreementCount;
        SubAgreement storage subAgreement = agreement.subAgreements[subAgreementId];
        subAgreement.agreementHash = _agreementHash;
        subAgreement.ipfsCID = _ipfsCID;
        subAgreement.subVendor = _subVendor;
        subAgreement.subVendorName = _subVendorName;
        subAgreement.isComplete = false;
        subAgreement.hasSigned[msg.sender] = false;
        subAgreement.hasSigned[_subVendor] = false;

        agreement.subAgreementCount++;
        
        // Emit event with fewer parameters
        emit SubAgreementCreated(_agreementId, subAgreementId, _subVendor, _subVendorName);
    }

    function viewAgreement(uint256 _agreementId)
        external
        view
        returns (
            string memory agreementHash,
            string memory ipfsCID,
            address vendor,
            string memory vendorName,
            bool isComplete,
            uint256 subAgreementCount,
            uint256[] memory subAgreementIndexes
        )
    {
        Agreement storage agreement = agreements[_agreementId];
        uint256[] memory subIndexes = new uint256[](agreement.subAgreementCount);
        for (uint256 i = 0; i < agreement.subAgreementCount; i++) {
            subIndexes[i] = i;
        }

        return (
            agreement.agreementHash,
            agreement.ipfsCID,
            agreement.vendor,
            agreement.vendorName,
            agreement.isComplete,
            agreement.subAgreementCount,
            subIndexes
        );
    }

    function viewSubAgreement(uint256 _agreementId, uint256 _subAgreementId)
        external
        view
        returns (
            string memory agreementHash,
            string memory ipfsCID,
            address subVendor,
            string memory subVendorName,
            bool isComplete
        )
    {
        Agreement storage agreement = agreements[_agreementId];
        SubAgreement storage subAgreement = agreement.subAgreements[_subAgreementId];

        return (
            subAgreement.agreementHash,
            subAgreement.ipfsCID,
            subAgreement.subVendor,
            subAgreement.subVendorName,
            subAgreement.isComplete
        );
    }

    // Sign a main agreement
    function signAgreement(uint256 _agreementId) external {
        Agreement storage agreement = agreements[_agreementId];
        require(!agreement.isComplete, "Agreement is already complete");

        // Ensure only authorized parties can sign the agreement
        require(
            msg.sender == owner || msg.sender == agreement.vendor,
            "Unauthorized signer"
        );

        if (msg.sender == owner) {
            require(!agreement.hasSigned[owner], "Owner has already signed");
            agreement.hasSigned[owner] = true;
            emit AgreementSigned(_agreementId, msg.sender);
        } else if (msg.sender == agreement.vendor) {
            // Ensure all sub-agreements are completed before signing
            for (uint256 i = 0; i < agreement.subAgreementCount; i++) {
                require(agreement.subAgreements[i].isComplete, "All sub-agreements must be complete before signing");
            }
            require(!agreement.hasSigned[agreement.vendor], "Vendor has already signed");
            agreement.hasSigned[agreement.vendor] = true;
            emit AgreementSigned(_agreementId, msg.sender);
        }

        // Check if both parties have signed
        if (agreement.hasSigned[owner] && agreement.hasSigned[agreement.vendor]) {
            agreement.isComplete = true;
        }
    }


    // Sign a sub-agreement
    function signSubAgreement(uint256 _agreementId, uint256 _subAgreementId) external {
        Agreement storage agreement = agreements[_agreementId];
        SubAgreement storage subAgreement = agreement.subAgreements[_subAgreementId];
        require(!subAgreement.isComplete, "Sub-agreement is already complete");

        // Ensure only authorized participants can sign
        require(
            msg.sender == agreement.vendor || msg.sender == subAgreement.subVendor,
            "Unauthorized signer"
        );

        if (msg.sender == agreement.vendor) {
            require(!subAgreement.hasSigned[msg.sender], "Vendor has already signed this sub-agreement");
            subAgreement.hasSigned[msg.sender] = true;
            emit SubAgreementSigned(_agreementId, _subAgreementId, msg.sender);
        } else if (msg.sender == subAgreement.subVendor) {
            require(!subAgreement.hasSigned[msg.sender], "Sub-vendor has already signed this sub-agreement");
            subAgreement.hasSigned[msg.sender] = true;
            emit SubAgreementSigned(_agreementId, _subAgreementId, msg.sender);
        }

        // Check if both parties have signed
        if (subAgreement.hasSigned[agreement.vendor] && subAgreement.hasSigned[subAgreement.subVendor]) {
            subAgreement.isComplete = true;
        }
    }
}