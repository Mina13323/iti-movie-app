import { BrowserRouter } from "react-router-dom";
import AppRouter from "./app/router";
import Navbar from "./components/common/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;