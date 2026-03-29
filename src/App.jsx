import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import Navbar from "./components/common/Navbar";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <>
          <Toaster position="top-center" richColors />
          <Navbar />
        </>
      ),
      children: [
        {
          index: true,
          element: <HomePage />,
        },
        {
          path: 'login',
          element: <LoginPage />,
        },
        {
          path: 'signup',
          element: <RegisterPage />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;