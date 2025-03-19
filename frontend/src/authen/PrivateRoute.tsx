import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../authen/AuthContext.tsx";

interface PrivateRouteProps {
  children: React.ReactNode;
  redirectPath: string;
}

const PrivateRoute = ({ children, redirectPath }: PrivateRouteProps) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {return <Navigate to={redirectPath} />}
  return <>{children}</>;
};

export default PrivateRoute;
