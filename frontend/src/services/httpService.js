import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

export const post = async (url, data) => {
    return (await axiosInstance.post(url, data)).data;
};

export default axiosInstance;
