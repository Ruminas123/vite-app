import "./App.css";
import { Outlet } from "react-router-dom";
import Navbar from "./components/navbar.tsx";  // Without .tsx extension
import { AuthProvider } from "./authen/AuthContext.tsx"; // Without .tsx extension
import 'primeicons/primeicons.css';

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Outlet />
    </AuthProvider>
  );
}

export default App;
