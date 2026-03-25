import axiosInstance from "../lib/axios";

export const getNowPlaying = () => axiosInstance.get("/movie/now_playing");
export const getMovieDetails = (id) => axiosInstance.get(`/movie/${id}`);
export const getRecommendations = (id) =>
  axiosInstance.get(`/movie/${id}/recommendations`);
export const getMovieVideos = (id) => axiosInstance.get(`/movie/${id}/videos`);
export const searchMovies = (query) =>
  axiosInstance.get("/search/movie", { params: { query } });
export const getGenres = () => axiosInstance.get("/genre/movie/list");