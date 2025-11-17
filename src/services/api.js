import axios from "axios";

// Pega a URL do backend do arquivo .env
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  // timeout: 30000, // 30 segundos de timeout
});

// // Contador de requisições ativas
// let activeRequests = 0;
// let loadingCallbacks = [];

// // Função para notificar mudanças no estado de loading
// export const setLoadingCallbacks = (callbacks) => {
//   loadingCallbacks = callbacks;
// };

// const updateLoading = (isLoading, message = 'Carregando...') => {
//   loadingCallbacks.forEach(cb => {
//     if (cb.setLoading) cb.setLoading(isLoading);
//     if (cb.setLoadingMessage) cb.setLoadingMessage(message);
//   });
// };

// // Interceptador de requisições
// api.interceptors.request.use(
//   (config) => {
//     activeRequests++;
    
//     // Se é a primeira requisição, mostra loading
//     if (activeRequests === 1) {
//       updateLoading(true, 'Conectando ao servidor...');
//     }
    
//     return config;
//   },
//   (error) => {
//     activeRequests = Math.max(0, activeRequests - 1);
//     if (activeRequests === 0) {
//       updateLoading(false);
//     }
//     return Promise.reject(error);
//   }
// );

// // Interceptador de respostas
// api.interceptors.response.use(
//   (response) => {
//     activeRequests = Math.max(0, activeRequests - 1);
    
//     // Se não há mais requisições, esconde loading
//     if (activeRequests === 0) {
//       updateLoading(false);
//     }
    
//     return response;
//   },
//   (error) => {
//     activeRequests = Math.max(0, activeRequests - 1);
    
//     if (activeRequests === 0) {
//       updateLoading(false);
//     }
    
//     // Se for erro de timeout ou conexão
//     if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
//       updateLoading(false);
//       return Promise.reject(new Error('Conexão lenta ou instável. Tente novamente.'));
//     }
    
//     return Promise.reject(error);
//   }
// );

export default api;
