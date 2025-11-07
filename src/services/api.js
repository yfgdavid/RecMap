import axios from "axios";

// Pega a URL do backend do arquivo .env
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export default api;
