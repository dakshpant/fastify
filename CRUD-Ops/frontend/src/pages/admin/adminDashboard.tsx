import { api } from "../../services/api.services";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type User = {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
};

export const AdminDashboard = () => {
  //saving users in array cuz its admin dashboard easy to mab data
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    api
      .get("/user")
      .then((res) => {
        console.log("USERS RESPONSE", res);
        setUsers(res.data); // ← depends on backend
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);
  if (loading) return <p>Fetching Users.....</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">All Users</h1>

      <table className="w-full border-collapse bg-white">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Role</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="p-2 border">{user.id}</td>
              <td className="p-2 border">{user.name}</td>
              <td className="p-2 border">{user.email}</td>
              <td className="p-2 border">{user.role}</td>
              <td className="p-2 border">
                <Link
                  to={`/admin/users/${user.id}`}
                  className="text-blue-600 underline"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
