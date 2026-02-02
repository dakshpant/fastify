import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../services/api.services";

type Props = {
  mode: "self" | "admin";
};

type User = {
  id: number;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
};

const ProfilePage = ({ mode }: Props) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const isSelf = mode === "self";
  const isAdmin = mode === "admin";

  const [user, setUser] = useState<User | null>(null);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = isSelf
          ? await api.get("/auth/me")
          : await api.get(`/user/${id}`);

        setUser(res.data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch user");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [isSelf, id]);

  const handleUpdate = async () => {
    if (!user) return;

    setSaving(true);
    try {
      if (isSelf) {
        await api.put("/auth/me", {
          name: user.name,
          email: user.email,
          ...(password && { password }),
        });
      } else {
        await api.put(`/user/${user.id}`, {
          name: user.name,
          email: user.email,
          role: user.role,
        });
      }

      alert("User updated successfully");
      setPassword("");
    } finally {
      setSaving(false);
    }
  };
  const handleDelete = async () => {
    const ok = window.confirm("Are you sure?");
    if (!ok) return;

    if (isSelf) {
      await api.delete("/auth/me");
      navigate("/register");
    } else {
      await api.delete(`/user/${user?.id}`);
      navigate("/admin");
    }
  };

  const handleLogout = async () => {
    await api.post("/auth/logout");
    navigate("/login");
  };

  if (loading) return <p className="text-center mt-10">Loading profile…</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;
  if (!user) return null;


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white px-12 pt-16 pb-10 shadow-2xl rounded-3xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isSelf ? "My Profile" : "User Profile"}
        </h2>

        {/* Name */}
        <label className="font-bold">Name</label>
        <input
          className="w-full border p-2 rounded mb-4"
          value={user.name}
          onChange={(e) => setUser({ ...user, name: e.target.value })}
        />

        {/* Email */}
        <label className="font-bold">Email</label>
        <input
          className="w-full border p-2 rounded mb-4"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
        />

        {/* Role (ADMIN ONLY) */}
        {isAdmin && (
          <>
            <label className="font-bold">Role</label>
            <select
              className="w-full border p-2 rounded mb-4"
              value={user.role}
              onChange={(e) =>
                setUser({
                  ...user,
                  role: e.target.value as "USER" | "ADMIN",
                })
              }
            >
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </>
        )}

        {/* Password (SELF ONLY) */}
        {(isSelf||isAdmin) && (
          <>
            <label className="font-bold">New Password</label>
            <input
              className="w-full border p-2 rounded mb-4"
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </>
        )}

        {/* ACTIONS */}
        {(isSelf || isAdmin) && (
          <>
            <button
              onClick={handleUpdate}
              disabled={saving}
              className="w-full bg-blue-600 text-white py-2 rounded mt-4"
            >
              {saving ? "Saving..." : "Update User"}
            </button>

            <button
              onClick={handleDelete}
              className="w-full bg-red-600 text-white py-2 rounded mt-3"
            >
              Delete User
            </button>
          </>
        )}

        <button
          onClick={handleLogout}
          className="w-full bg-gray-700 text-white py-2 rounded mt-3"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
