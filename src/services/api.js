import axios from "axios";

const api = axios.create({
  baseURL: "https://recmap-backend-production.up.railway.app", // URL do backend
});

export default api;