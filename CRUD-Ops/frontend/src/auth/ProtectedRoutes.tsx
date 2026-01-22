import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../auth/auth.utils";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  return children;
};

export default ProtectedRoute;
