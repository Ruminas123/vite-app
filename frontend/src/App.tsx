
import "./App.css";
import { Outlet } from "react-router-dom";
import Navbar from "./components/navbar";

function App() {
  return (
    <>
      <div style={{ fontFamily: 'Arial, sans-serif' }}>
        <Navbar />
        <Outlet />
      </div>
    </>
  );
}

export default App;