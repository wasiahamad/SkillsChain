// Placeholder for blockchain/contracts/Certificate.sol
// backend/blockchain/contracts/Certificate.sol
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Certificate {
    struct Cert {
        uint id;
        string title;
        address issuedTo;
        address issuedBy;
        uint timestamp;
    }

    mapping(uint => Cert) public certificates;
    uint public certCount;

    event CertificateIssued(uint id, string title, address issuedTo, address issuedBy);

    function issueCertificate(address _to, string memory _title) public {
        certCount++;
        certificates[certCount] = Cert(certCount, _title, _to, msg.sender, block.timestamp);
        emit CertificateIssued(certCount, _title, _to, msg.sender);
    }

    function verifyCertificate(uint _id) public view returns (Cert memory) {
        return certificates[_id];
    }
}
