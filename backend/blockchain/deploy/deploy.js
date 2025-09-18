// Placeholder for blockchain/deploy/deploy.js

// backend/blockchain/deploy/deploy.js
import fs from "fs";
import path from "path";
import Web3 from "web3";
import solc from "solc";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const web3 = new Web3("http://127.0.0.1:7545"); // Ganache local

// Compile contract using correct solc version
const contractPath = path.resolve(__dirname, "../contracts/Certificate.sol");
const source = fs.readFileSync(contractPath, "utf8");

// Use solc.loadRemoteVersion to get 0.8.x
const solcVersion = "v0.8.15+commit.e14f2714"; // Match contract bytecode and Ganache EVM

solc.loadRemoteVersion(solcVersion, async (err, solcSpecific) => {
    if (err) {
        console.error("Error loading solc version:", err);
        return;
    }
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
    const output = JSON.parse(solcSpecific.compile(JSON.stringify(input)));
    if (!output.contracts || !output.contracts["Certificate.sol"] || !output.contracts["Certificate.sol"]["Certificate"]) {
        console.error("Compilation failed:", output.errors);
        return;
    }
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
});
