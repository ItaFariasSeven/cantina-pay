import axios from 'axios';

const api = axios.create({
  baseURL: 'http://10.227.22.5:3333', // ← troque pelo IP da sua máquina
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;