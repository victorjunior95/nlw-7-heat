import axios from "axios";

// permite a conexão/comunicação com a aplicação back-end
export const api = axios.create({
  baseURL: "http://localhost:4000",
})