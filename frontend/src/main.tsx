import ReactDOM from "react-dom/client";
import React from 'react';  // เพิ่มการ import React
import App from "./App.tsx";
import "./index.css";
import PrivateRoute from "./authen/PrivateRoute.tsx";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Home } from "./pages/Home.tsx";
import { Contact } from "./pages/Contact.tsx";
import { Login } from "./pages/Login.tsx";
import { Dashboard } from "./pages/Dashboard.tsx";
import { CreateEmployee } from "./pages/CreateEmployee.tsx";
import { CreatePosition } from "./pages/CreatePosition.tsx";
import { AwatForm } from "./pages/AwatForm.tsx";
import { AwatTeamList } from "./pages/AwatTeamList.tsx";
import { AwatTeamForm } from "./pages/AwatTeamForm.tsx";
import { AwatManagerForm } from "./pages/AwatManagerForm.tsx";
import { AwatStatistics } from "./pages/AwatStatistics.tsx";

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
      {
        path: "/vite-app/awat-form",
        element: (
          <PrivateRoute redirectPath="/vite-app/login">
            <AwatForm />
          </PrivateRoute>
        ),
      },
      {
        path: "/vite-app/awat-team-list",
        element: (
          <PrivateRoute redirectPath="/vite-app/login">
            <AwatTeamList />
          </PrivateRoute>
        ),
      },
      {
        path: "/vite-app/awat-team-form/:employee_id",
        element: (
          <PrivateRoute redirectPath="/vite-app/login">
            <AwatTeamForm />
          </PrivateRoute>
        ),
      },
      {
        path: "/vite-app/awat-manager-form/:henchman_id",
        element: (
          <PrivateRoute redirectPath="/vite-app/login">
            <AwatManagerForm />
          </PrivateRoute>
        ),
      },
      {
        path: "/vite-app/awat-statistics",
        element: (
          <PrivateRoute redirectPath="/vite-app/login">
            <AwatStatistics />
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
