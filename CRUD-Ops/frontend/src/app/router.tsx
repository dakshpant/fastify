import { Routes, Route, Navigate } from "react-router-dom";
import Register from "../pages/registrationPage";
import Login from "../pages/LoginPage";
import Me from "../pages/ProfilePage"
import ProtectedRoute from "../auth/ProtectedRoutes";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/me"
        element={
          <ProtectedRoute>
            <Me />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default AppRouter;
