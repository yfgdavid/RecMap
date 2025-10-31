import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3333", // URL do backend
});

export default api;