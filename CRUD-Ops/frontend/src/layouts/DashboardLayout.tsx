import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* NAVBAR */}
      <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <span className="font-bold text-lg">Dashboard</span>

          <Link to="/me" className="hover:underline">
            Profile
          </Link>

          {/* Admin button will come later */}
          {user?.role === "ADMIN" && (
            <Link to="/admin" className="hover:underline">
              Admin
            </Link>
          )}
        </div>

        <div className="flex gap-4 items-center">
          <span className="text-sm opacity-80">
            {user?.email}
          </span>

          <button
            onClick={handleLogout}
            className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* PAGE CONTENT */}
      <main className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
