const axios = require('axios');

const axiosClient = axios.create({
    baseURL: process.env.CASSO_API_URL,
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Apikey ${process.env.CASSO_API_KEY}`,
    },
});

axiosClient.interceptors.request.use(async (config) => {
    return config;
});

axiosClient.interceptors.response.use(
    (response) => {
        if (response && response.data) return response.data;
        return response;
    },
    (error) => {
        throw error;
    },
);

module.exports = axiosClient;
