import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import { LanguageProvider } from "./context/LanguageContext";
import { ProtectedRoute, PublicOnlyRoute } from "./components/auth/ProtectedRoute";
import { AuthGuardProvider } from "./context/AuthGuardContext";
import { ThemeProvider } from "./components/theme-provider";
import MovieSkeleton from "./components/movie/MovieSkeleton";

// Lazy Loaded Pages
const Navbar = lazy(() => import("./components/common/Navbar"));
const HomePage = lazy(() => import("./pages/HomePage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const SearchResultsPage = lazy(() => import("./pages/SearchResultsPage"));
const MovieDetailsPage = lazy(() => import("./pages/MovieDetailsPage"));
const SeriesDetailsPage = lazy(() => import("./pages/SeriesDetailsPage"));
const WishlistPage = lazy(() => import("./pages/WishlistPage"));
const MoviesPage = lazy(() => import("./pages/MoviesPage"));
const SeriesPage = lazy(() => import("./pages/SeriesPage"));
const AccountPage = lazy(() => import("./pages/AccountPage"));
const AuthCallbackPage = lazy(() => import("./pages/AuthCallbackPage"));
const Footer = lazy(() => import("./components/common/Footer"));
const BackToTop = lazy(() => import("./components/ui/BackToTop"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <AuthGuardProvider>
          <Toaster position="top-center" richColors />
          <Suspense fallback={
            <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
              <div className="text-[#E50914] font-black text-4xl animate-pulse tracking-tighter">NETMOVIES</div>
              <div className="w-48 h-1 bg-muted overflow-hidden rounded-full">
                <div className="w-full h-full bg-[#E50914] animate-progress-loading" />
              </div>
            </div>
          }>
            <Navbar />
            <main className="min-h-screen bg-background text-foreground transition-colors duration-300">
              <Outlet />
            </main>
            <Footer />
            <BackToTop />
          </Suspense>
        </AuthGuardProvider>
      ),
      children: [
        {
          index: true,
          element: <HomePage />,
        },
        {
          path: 'login',
          element: (
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          ),
        },
        {
          path: 'signup',
          element: (
            <PublicOnlyRoute>
              <RegisterPage />
            </PublicOnlyRoute>
          ),
        },
        {
          path: 'auth/callback',
          element: <AuthCallbackPage />,
        },
        {
          path: 'account',
          element: (
            <ProtectedRoute>
              <AccountPage />
            </ProtectedRoute>
          ),
        },
        {
          path: 'search',
          element: (
             <ProtectedRoute>
               <SearchResultsPage />
             </ProtectedRoute>
          ),
        },
        {
          path: 'movie/:id',
          element: (
            <ProtectedRoute>
              <MovieDetailsPage />
            </ProtectedRoute>
          ),
        },
        {
          path: 'series/:id',
          element: (
            <ProtectedRoute>
              <SeriesDetailsPage />
            </ProtectedRoute>
          ),
        },
        {
          path: 'wishlist',
          element: (
            <ProtectedRoute>
              <WishlistPage />
            </ProtectedRoute>
          ),
        },
        {
          path: 'movies',
          element: (
            <ProtectedRoute>
              <MoviesPage />
            </ProtectedRoute>
          ),
        },
        {
          path: 'series',
          element: (
            <ProtectedRoute>
              <SeriesPage />
            </ProtectedRoute>
          ),
        },
        {
          path: '*',
          element: <NotFoundPage />,
        },
      ],
    },
  ]);

  return (
    <LanguageProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;