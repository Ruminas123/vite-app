import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Home } from "./pages/Home.tsx";
import { Contact } from "./pages/Contact.tsx";
import { Login } from "./pages/Login.tsx";

const router = createBrowserRouter([
  {
    path: "/vite-app/",
    element: <App />,
    children: [
      {
        path: "/vite-app/",
        element: <Home />,
      },
      {
        path: "/vite-app/contact",
        element: <Contact />,
      },
      {
        path: "/vite-app/login",
        element: <Login />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);