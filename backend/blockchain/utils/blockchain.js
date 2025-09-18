

import Web3 from 'web3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let web3;
if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
  web3 = new Web3(window.ethereum);
} else {
  // Use Ganache local provider or env variable
  web3 = new Web3(new Web3.providers.HttpProvider(process.env.BLOCKCHAIN_PROVIDER_URL || 'http://127.0.0.1:7545'));
}

// Load ABI and contract address from build/contracts/Certificate.json
const contractBuildPath = path.resolve(__dirname, '../build/contracts/Certificate.json');
const contractBuild = JSON.parse(fs.readFileSync(contractBuildPath, 'utf8'));

const certificateContractABI = contractBuild.abi;
// Get the first available network address
let certificateContractAddress = null;
if (contractBuild.networks && Object.keys(contractBuild.networks).length > 0) {
  const firstNetwork = Object.keys(contractBuild.networks)[0];
  certificateContractAddress = contractBuild.networks[firstNetwork].address;
}

if (!certificateContractAddress) {
  throw new Error('Contract address not found in Certificate.json');
}

const certificateContract = new web3.eth.Contract(
  certificateContractABI,
  certificateContractAddress
);

export { web3, certificateContract };