import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_TMDB_BASE_URL,
});

axiosInstance.interceptors.request.use((config) => {
  config.params = {
    ...config.params,
    api_key: import.meta.env.VITE_TMDB_API_KEY,
  };
  return config;
});

export default axiosInstance;