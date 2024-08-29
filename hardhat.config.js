require('dotenv').config();
require('@nomicfoundation/hardhat-toolbox');
const { vars } = require('hardhat/config');
const INFURA_ENDPOINT = process.env.ENDPOINT;
const SEPOLIA_PRIVATE_KEY = process.env.PRIVATE_KEY;

module.exports = {
    solidity: {
        version: '0.8.24',
        settings: {
            optimizer: {
                enabled: true,
                runs: 10000,
            },
        },
    },
    networks: {
        sepolia: {
            url: INFURA_ENDPOINT,
            accounts: [SEPOLIA_PRIVATE_KEY],
        },
    },
    paths: {
        artifacts: './artifacts',
    },
};
