import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigationRef } from '../../App';

const api = axios.create({
  // baseURL: 'http://10.227.18.30:3333', // Trabalho - FAAMA-CORP
  // baseURL: 'http://10.227.22.32:3333', // Quarto - ADV-GUEST 2
  // baseURL: 'http://10.227.24.97:3333', // Quarto - FAAMA-EDU 2
  // baseURL: 'http://10.227.76.178:3333', // Trabalho/APK - FAAMA-BYOD 
  baseURL: 'https://beyond-nirvana-base-dui.trycloudflare.com',
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('@token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      console.error('Erro ao recuperar o token:', error);
      return config;
    }
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response, 
  async (error) => {
    if (error.response && error.response.status === 401) {
      console.log('Acesso negado (401)! Limpando memória e redirecionando...');
      
      // Limpa todos os dados da pessoa
      await AsyncStorage.clear(); 
      
      // 2. SE A TELA ESTIVER CARREGADA, FORÇA A VOLTA PARA O LOGIN!
      if (navigationRef.isReady()) {
        navigationRef.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      }
    }
    return Promise.reject(error);
  }
);

export default api;