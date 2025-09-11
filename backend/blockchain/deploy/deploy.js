// Placeholder for blockchain/deploy/deploy.js

// backend/blockchain/deploy/deploy.js
import fs from "fs";
import path from "path";
import Web3 from "web3";
import solc from "solc";

const web3 = new Web3("http://127.0.0.1:7545"); // Ganache local

// Compile contract
const contractPath = path.resolve(__dirname, "../contracts/Certificate.sol");
const source = fs.readFileSync(contractPath, "utf8");
const input = {
    language: "Solidity",
    sources: {
        "Certificate.sol": {
            content: source,
        },
    },
    settings: {
        outputSelection: {
            "*": {
                "*": ["abi", "evm.bytecode"],
            },
        },
    },
};
const output = JSON.parse(solc.compile(JSON.stringify(input)));
const abi = output.contracts["Certificate.sol"]["Certificate"].abi;
const bytecode = output.contracts["Certificate.sol"]["Certificate"].evm.bytecode.object;

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    const CertificateContract = new web3.eth.Contract(abi);
    const contract = await CertificateContract.deploy({ data: "0x" + bytecode })
        .send({ from: accounts[0], gas: 3000000 });

    console.log("Contract deployed at:", contract.options.address);

    // Save ABI and address for backend use
    fs.writeFileSync(
        path.resolve(__dirname, "../utils/Certificate.json"),
        JSON.stringify({ abi, address: contract.options.address }, null, 2)
    );
};

deploy();
