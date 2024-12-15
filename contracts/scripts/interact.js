require('dotenv').config();

const API_URI = process.env.ENDPOINT;
const API_KEY = process.env.API_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const contract = require('../Copyright.json');
const ethers = require('ethers');

const provider = new ethers.JsonRpcProvider(API_URI);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);

const contractAddress = process.env.CONTRACT_ADDR;
const contractInstance = new ethers.Contract(
    contractAddress,
    contract.abi,
    signer,
);
const contractWithSigner = contractInstance.connect(signer);

const addToAllowedWallet = async (wallet) => {
    const response = await contractWithSigner.addToAllowedWallet(wallet);
    console.log('Transaction Hash: ', response.hash);
};

async function main() {
    const response = await contractWithSigner.getUploadedSongs();
    console.log('Uploaded Songs: ', response);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
