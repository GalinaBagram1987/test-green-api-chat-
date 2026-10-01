import axios from 'axios';

// const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// if (!BASE_URL) {
//   throw new Error('Не задан NEXT_PUBLIC_API_URL');
// }

export const axiosInstance = axios.create({
  baseURL: 'https://3100.api.green-api.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
