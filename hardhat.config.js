require('dotenv').config();
require('@nomicfoundation/hardhat-toolbox');

/** @type import('hardhat/config').HardhatUserConfig */

const { vars } = require('hardhat/config');
const INFURA_API_KEY = vars.get(process.env.API_KEY);
const SEPOLIA_PRIVATE_KEY = vars.get(process.env.PRIVATE_KEY);

module.exports = {
    solidity: '0.8.24',
    networks: {
        sepolia: {
            url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
            accounts: [SEPOLIA_PRIVATE_KEY],
        },
    },
    paths: {
        artifacts: './artifacts',
    },
};
