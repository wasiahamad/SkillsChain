import Web3 from 'web3';

let web3;

if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
  web3 = new Web3(window.ethereum);
} else {
  web3 = new Web3(new Web3.providers.HttpProvider(process.env.BLOCKCHAIN_PROVIDER_URL));
}

// Contract ABI and Address (to be updated after deployment)
const certificateContractABI = [
  {
    constant: false,
    inputs: [
      { name: 'studentName', type: 'string' },
      { name: 'courseName', type: 'string' },
      { name: 'completionDate', type: 'string' },
      { name: 'certificateId', type: 'string' }
    ],
    name: 'issueCertificate',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ name: 'certificateId', type: 'string' }],
    name: 'verifyCertificate',
    outputs: [
      { name: 'studentName', type: 'string' },
      { name: 'courseName', type: 'string' },
      { name: 'completionDate', type: 'string' },
      { name: 'isValid', type: 'bool' }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
}];
const certificateContractAddress = process.env.CONTRACT_ADDRESS;

const certificateContract = new web3.eth.Contract(
  certificateContractABI,
  certificateContractAddress
);

export { web3, certificateContract };