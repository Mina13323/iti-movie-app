export const API_PATHS = {
  NOW_PLAYING: "/movie/now_playing",
  MOVIE_DETAILS: (id) => `/movie/${id}`,
  RECOMMENDATIONS: (id) => `/movie/${id}/recommendations`,
  VIDEOS: (id) => `/movie/${id}/videos`,
  SEARCH: "/search/movie",
  GENRES: "/genre/movie/list",
  DISCOVER: "/discover/movie",
};