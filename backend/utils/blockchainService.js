import Web3 from 'web3';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const web3 = new Web3('http://127.0.0.1:7545'); // Ganache local

const contractData = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../blockchain/build/contracts/Certificate.json')));
const networkId = Object.keys(contractData.networks)[0];
const contractAddress = contractData.networks[networkId].address;
const certificateContract = new web3.eth.Contract(contractData.abi, contractAddress);


// Issue certificate on blockchain
const issueBlockchainCertificate = async (toAddress, certHash) => {
  try {
    const accounts = await web3.eth.getAccounts();
    const result = await certificateContract.methods
      .issueCertificate(toAddress, certHash)
      .send({ from: accounts[0], gas: 3000000 });

    // Debug: log all events and transaction details
    console.log('Blockchain transaction result:', result);
    if (result.events) {
      Object.keys(result.events).forEach(eventName => {
        console.log(`Event: ${eventName}`, result.events[eventName]);
      });
    }

    // Get the certificate ID from the event emitted by the contract
    let certificateId = null;
    if (result.events && result.events.CertificateIssued && result.events.CertificateIssued.returnValues) {
      certificateId = result.events.CertificateIssued.returnValues.certificateId;
    }
    return { transactionHash: result.transactionHash, certificateId };
  } catch (error) {
    console.error('Error issuing certificate on blockchain:', error);
    // Include the actual error message for easier debugging
    throw new Error(`Failed to issue certificate on blockchain: ${error.message || error}`);
  }
};

// Verify certificate on blockchain
const verifyBlockchainCertificate = async (certId) => {
  try {
    const cert = await certificateContract.methods.certificates(certId).call();
    const title = await certificateContract.methods.getCertificateTitle(certId).call();
    return { ...cert, title };
  } catch (error) {
    console.error('Error verifying certificate on blockchain:', error);
    throw new Error('Failed to verify certificate on blockchain');
  }
};

export { issueBlockchainCertificate, verifyBlockchainCertificate };