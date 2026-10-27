import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'http://10.227.24.60:3333', // quarto na rede FAAMA-EDU
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptador: Executa essa função ANTES de cada requisição ir para o backend
api.interceptors.request.use(
  async (config) => {
    // Busca o token salvo no celular (que foi salvo na hora do Login)
    const token = await AsyncStorage.getItem('@token');
    
    // Se o token existir, coloca ele no cabeçalho de Autorização
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;