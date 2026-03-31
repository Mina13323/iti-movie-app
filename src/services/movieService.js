import axiosInstance from "../lib/axios";

export const getNowPlaying = (page = 1) => axiosInstance.get("/movie/now_playing", { params: { page } });
export const getPopularMovies = (page = 1) => axiosInstance.get("/movie/popular", { params: { page } });
export const getPopularTV = (page = 1) => axiosInstance.get("/tv/popular", { params: { page } });
export const getTopRatedMovies = (page = 1) => axiosInstance.get("/movie/top_rated", { params: { page } });
export const getMovieDetails = (id) => axiosInstance.get(`/movie/${id}`);
export const getTVDetails = (id) => axiosInstance.get(`/tv/${id}`);
export const getRecommendations = (id) =>
  axiosInstance.get(`/movie/${id}/recommendations`);
export const getTVRecommendations = (id) =>
  axiosInstance.get(`/tv/${id}/recommendations`);
export const getMovieVideos = (id) => axiosInstance.get(`/movie/${id}/videos`);
export const getTVVideos = (id) => axiosInstance.get(`/tv/${id}/videos`);
export const searchMovies = (query, page = 1) =>
  axiosInstance.get("/search/movie", { params: { query, page } });
export const searchTV = (query, page = 1) =>
  axiosInstance.get("/search/tv", { params: { query, page } });
export const getGenres = () => axiosInstance.get("/genre/movie/list");
export const getTVGenres = () => axiosInstance.get("/genre/tv/list");

export const discoverMovies = (params) => axiosInstance.get("/discover/movie", { params });
export const discoverTV = (params) => axiosInstance.get("/discover/tv", { params });

// TMDb Authentication
export const getRequestToken = () => axiosInstance.get("/authentication/token/new");
export const createSession = (requestToken) => 
  axiosInstance.post("/authentication/session/new", { request_token: requestToken });
export const getAccountDetails = (sessionId) => 
  axiosInstance.get("/account", { params: { session_id: sessionId } });

// TMDb Account Actions
export const toggleFavorite = (accountId, sessionId, mediaType, mediaId, favorite) =>
  axiosInstance.post(`/account/${accountId}/favorite`, {
    media_type: mediaType,
    media_id: mediaId,
    favorite: favorite
  }, { params: { session_id: sessionId } });

export const toggleWatchlist = (accountId, sessionId, mediaType, mediaId, watchlist) =>
  axiosInstance.post(`/account/${accountId}/watchlist`, {
    media_type: mediaType,
    media_id: mediaId,
    watchlist: watchlist
  }, { params: { session_id: sessionId } });