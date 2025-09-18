// Placeholder for blockchain/test/certificateTest.js

// backend/blockchain/test/certificateTest.js
import { issueBlockchainCertificate, verifyBlockchainCertificate } from "../../utils/blockchainService.js";

const testCertificate = async () => {
  try {
    const txHash = await issueBlockchainCertificate("0x1234567890abcdef1234567890abcdef12345678", "React Course");
    console.log("Issued Tx:", txHash);

    const cert = await verifyBlockchainCertificate(1);
    console.log("Verified Cert:", cert);
  } catch (error) {
    console.error("Test error:", 
      error);
  }
};

testCertificate();
