import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.API_URL || "http://localhost:5000/api",
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
