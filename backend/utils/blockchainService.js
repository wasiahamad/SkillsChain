 
import { web3 } from '../blockchain/utils/blockchain.js';
import { certificateContract } from '../blockchain/utils/blockchain.js';


// Issue certificate on blockchain
const issueBlockchainCertificate = async (toAddress, certHash) => {
  try {
    const accounts = await web3.eth.getAccounts();
    const result = await certificateContract.methods
      .issueCertificate(toAddress, certHash)
      .send({ from: accounts[0], gas: 3000000 });
    
    return result;
  } catch (error) {
    console.error('Error issuing certificate on blockchain:', error);
    throw new Error('Failed to issue certificate on blockchain');
  }
};

// Verify certificate on blockchain
const verifyBlockchainCertificate = async (certId) => {
  try {
    const certificate = await certificateContract.methods.getCertificate(certId).call();
    return certificate;
  } catch (error) {
    console.error('Error verifying certificate on blockchain:', error);
    throw new Error('Failed to verify certificate on blockchain');
  }
};

export { issueBlockchainCertificate, verifyBlockchainCertificate };