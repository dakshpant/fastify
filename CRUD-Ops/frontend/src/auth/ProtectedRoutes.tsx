import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { loading, isAuthenticated, user } = useAuth();

  console.log("PROTECTED ROUTE CHECK", {
    loading,
    isAuthenticated,
    user,
  });

  if (loading) return <div>Checking authentication...</div>;

  if (!isAuthenticated) {
    console.log("BLOCKED — redirecting to login");
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
