import { JSX } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  element: JSX.Element;
  requiredPermission: string;
  userPermissions: string[];
}

const ProtectedRoute = ({ element, requiredPermission, userPermissions }: ProtectedRouteProps) => {
  const location = useLocation();
  
  if (!userPermissions.includes(requiredPermission)) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return element;
};

export default ProtectedRoute;
