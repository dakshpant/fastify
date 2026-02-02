
/**
 * This is teh AdminRoutes component that protects routes meant only for admin users.
 * It checks if the user is authenticated and has the "ADMIN" role.
 * If not authenticated, it redirects to the login page.
 * If authenticated but not an admin, it redirects to the profile page.
 * If authenticated as an admin, it renders the child components.
 * Although the admin routes are protected in the backend, this frontend protection enhances user experience by preventing unauthorized access attempts.
 */
/*---------------------------------------------------------------------------*/
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

type Props = {
  children: JSX.Element;
};

const AdminRoutes = ({ children }: Props) => {
  const { loading, isAuthenticated, user } = useAuth();

  if (loading) return <div>Checking permissions...</div>;
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "ADMIN") {
    return <Navigate to="/me" replace />;
  }

  return children;
};

export default AdminRoutes;