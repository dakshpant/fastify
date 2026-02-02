import { Routes, Route, Navigate } from "react-router-dom";
import Register from "../pages/registrationPage";
import Login from "../pages/LoginPage";
import ProtectedRoute from "../auth/ProtectedRoutes";
import AdminRoute from "../auth/adminRoutes";
import DashboardLayout from "../layouts/DashboardLayout";
import ProfilePage from "../pages/ProfilePage";
import { AdminDashboard } from "../pages/admin/adminDashboard";

const AppRouter = () => {
  return (
    <Routes>
      {/* Public */}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      {/* Protected layout */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* User self profile */}
        <Route path="/me" element={<ProfilePage mode="self" />} />

        {/* Admin dashboard */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        {/* Admin viewing user profile */}
        <Route
          path="/admin/users/:id"
          element={
            <AdminRoute>
              <ProfilePage mode="admin" />
            </AdminRoute>
          }
        />
      </Route>

      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default AppRouter;
