import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../authen/AuthContext.tsx";

interface PrivateRouteProps {
  children: React.ReactNode;
  redirectPath: string;
  requiredStatus?: number; // เพิ่มเงื่อนไข employee_status
}

const PrivateRoute = ({ children, redirectPath, requiredStatus }: PrivateRouteProps) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} />;
  }

  // เช็ค employee_status ก่อนให้เข้า
  if (requiredStatus !== undefined && user?.employee_status !== requiredStatus) {
    return <Navigate to="/vite-app/" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
