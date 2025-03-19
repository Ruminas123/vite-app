import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Home } from "./pages/Home.tsx";
import { Contact } from "./pages/Contact.tsx";
import { Login } from "./pages/Login.tsx";
import { Dashboard } from "./pages/Dashboard.tsx";
import { CreateEmployee } from "./pages/CreateEmployee.tsx"
import { CreatePosition } from "./pages/CreatePosition.tsx"
import { ManageEmployee } from "./pages/ManageEmployee.tsx"

const router = createBrowserRouter([
  {
    path: "/vite-app",
    element: <App />,
    children: [
      {
        path: "/vite-app",
        element: <Home />,
      },
      {
        path: "/vite-app/login",
        element: <Login />,
      },
      {
        path: "/vite-app/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/vite-app/contact",
        element: <Contact />,
      },
      {
        path: "/vite-app/create-employee",
        element: <CreateEmployee />,
      },
      {
        path: "/vite-app/create-position",
        element: <CreatePosition />,
      },
      {
        path: "/vite-app/manage-employee",
        element: <ManageEmployee />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);