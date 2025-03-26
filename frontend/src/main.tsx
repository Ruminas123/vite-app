import ReactDOM from "react-dom/client";
import React from 'react';  // เพิ่มการ import React
import App from "./App.tsx";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Home } from "./pages/Home.tsx";
import { Contact } from "./pages/Contact.tsx";
import { Login } from "./pages/Login.tsx";
import { Dashboard } from "./pages/Dashboard.tsx";
import { CreateEmployee } from "./pages/CreateEmployee.tsx";
import { CreatePosition } from "./pages/CreatePosition.tsx";
import PrivateRoute from "./authen/PrivateRoute.tsx"; // Import the PrivateRoute component

const router = createBrowserRouter([
  {
    path: "/vite-app",
    element: <App />,
    children: [
      {
        path: "/vite-app",
        element: (
          <PrivateRoute redirectPath="/vite-app/login">
            <Home />
          </PrivateRoute>
        ),
      },
      {
        path: "/vite-app/login",
        element: <Login />,
      },
      {
        path: "/vite-app/dashboard",
        element: (
          <PrivateRoute redirectPath="/vite-app/login">
            <Dashboard />
          </PrivateRoute>
        ),
      },
      {
        path: "/vite-app/contact",
        element: (
          <PrivateRoute redirectPath="/vite-app/login">
            <Contact />
          </PrivateRoute>
        ),
      },
      {
        path: "/vite-app/create-employee",
        element: (
          <PrivateRoute redirectPath="/vite-app/login">
            <CreateEmployee />
          </PrivateRoute>
        ),
      },
      {
        path: "/vite-app/create-position",
        element: (
          <PrivateRoute redirectPath="/vite-app/login">
            <CreatePosition />
          </PrivateRoute>
        ),
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
