import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api.services";

type User = {
  id: number;
  name: string;
  email: string;
  password: string;
};

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await api.get("user/me");
        setUser(res.data);
      } catch (error: any) {
        setError(error.response.data.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, []);

  const handleUpdate = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await api.put("/user/updateMe", {
        name: user.name,
        email: user.email,
        password: user.password,
      });
      alert("Prifile Updates Successfully");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const ok = window.confirm("Are you sure you want to delete your account?");
    if (!ok) return;
    try {
      await api.delete("/user/deleteMe");
      localStorage.removeItem("access_token");
      navigate("/register");
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  // 🔹 UI states
  if (loading) {
    return <p className="text-center mt-10">Loading profile…</p>;
  }

  if (error) {
    return <p className="text-center text-red-600">{error}</p>;
  }

  if (!user) return null;
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div
        className="
          bg-white
          px-12
          pt-16
          pb-10
          shadow-2xl
          rounded-3xl
          text-center
          flex flex-col
          max-w-md
          w-full
        "
      >
        {/* Avatar */}
        <img
          src="https://github.com/github.png"
          alt="avatar"
          className="
            shadow-xl
            rounded-3xl
            h-30
            w-30
            mx-auto
            -mt-25
            mb-4
            transition-transform
            hover:scale-105
          "
        />

        {/* Editable fields */}
        <div className="flex flex-col gap-0">
          <label
            className="text-bold text-left text-xl font-bold"
            htmlFor="name"
          >
            Name
          </label>
          <input
            className="mt-2  text-center border rounded p-2"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-0 my-3 ">
          <label className="text-left font-bold text-xl" htmlFor="email">
            Email:
          </label>
          <input
            className="mt-2 text-center border rounded p-2"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
        </div>

        <div className="flex flex-col gap-0 my-3 text-center">
          <label className="text-left font-bold text-xl" htmlFor="Password">
            Password:
          </label>
          <input
            className="mt-2 text-center border rounded p-2"
            value={user.password}
            placeholder="Enter To Update Password"
            onChange={(e) => setUser({ ...user, password: e.target.value })}
          />
        </div>

        {/* Actions */}
        <button
          onClick={handleUpdate}
          disabled={saving}
          className="mt-6 w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
        >
          {saving ? "Updating..." : "Update Profile"}
        </button>

        <button
          onClick={handleLogout}
          className="mt-3 w-full bg-gray-700 text-white py-2 rounded"
        >
          Logout
        </button>

        <button
          onClick={handleDelete}
          className="mt-3 w-full bg-red-600 text-white py-2 rounded"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
