import { Link, Outlet } from "react-router-dom";

export default function App() {
  return (
    <>
      [FIXED_CONTENT]

      <nav>
        <Link to="/vite-app/">Home</Link>
        {" | "}
        <Link to="/vite-app/contact">Contact</Link>
      </nav>

      <Outlet />

      [FIXED_CONTENT]
    </>
  );
}