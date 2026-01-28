import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../services/api.services";

type Props = {
  children: JSX.Element;
};

const ProtectedRoute = ({ children }: Props) => {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  // const token = localStorage.getItem("access_token");
  useEffect(() => {
    api
      .get("/auth/me") // backend auth check
      .then(() => setAllowed(true))
      .catch(() => setAllowed(false))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div>Checking authentication...</div>;
  }

  if (!allowed) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
