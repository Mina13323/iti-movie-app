import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

export const getWishlistMovies = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/wishlist?api_key=${API_KEY}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
};