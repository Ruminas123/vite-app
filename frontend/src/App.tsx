
import "./App.css";
import { Link, Outlet } from "react-router-dom";
import React from "react";
import Navbar from "./components/navbar";

function App() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default App;