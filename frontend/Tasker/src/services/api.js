import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.API_URL || "https://justdoit-production-6a71.up.railway.app/api",
});

api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) config.headers.Authorization = `Bearer ${user.token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
