import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_TMDB_BASE_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const currentLang = localStorage.getItem("lang") || "en";
  
  config.params = {
    ...config.params,
    api_key: import.meta.env.VITE_TMDB_API_KEY,
    language: currentLang,
  };
  return config;
});

export default axiosInstance;