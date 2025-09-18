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

    // Get the title (string) for a certificate
    function getCertificateTitle(uint _id) public view returns (string memory) {
        return certificates[_id].title;
    }
}
            // REMOVED verifyCertificate function. Use mapping getter and getCertificateTitle instead.
