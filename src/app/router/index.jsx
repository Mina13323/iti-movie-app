import { Routes, Route } from "react-router-dom";

import HomePage from "../../pages/HomePage";
import MovieDetailsPage from "../../pages/MovieDetailsPage";
import WishlistPage from "../../pages/WishlistPage";
import SearchResultsPage from "../../pages/SearchResultsPage";
import LoginPage from "../../pages/LoginPage";
import RegisterPage from "../../pages/RegisterPage";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/movie/:id" element={<MovieDetailsPage />} />
      <Route path="/wishlist" element={<WishlistPage />} />
      <Route path="/search" element={<SearchResultsPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
}