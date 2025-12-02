import axios from "axios";

// Pega a URL do backend do arquivo .env ou usa localhost como padrão
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3333",
});



export default api;
