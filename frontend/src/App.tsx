import "./App.css";
import { Link, Outlet } from "react-router-dom";
import Navbar from "./components/navbar.tsx";  // Explicitly add .tsx extension
import { AuthProvider } from "./authen/AuthContext.tsx"; // Import the AuthProvider

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Outlet />
    </AuthProvider>
  );
}

export default App;
