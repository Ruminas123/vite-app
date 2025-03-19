import "./App.css";
import { Link, Outlet } from "react-router-dom";
import Navbar from "./components/navbar.tsx";  // Explicitly add .tsx extension

function App() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default App;
