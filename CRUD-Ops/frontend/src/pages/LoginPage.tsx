import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api.services";
//The below is for the local storage token storage
// import { setToken } from "../auth/auth.utils";

interface LoginFormDTO {
  email: string;
  password: string;
}

const LoginPage = () => {
  const [form, setForm] = useState<LoginFormDTO>({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.post("/auth/login", form);

      console.log("LOGIN RESPONSE:", res);

      /**
       * 
       *   const token = res.accessToken;

      if (!token) throw new Error("NO_TOKEN");

      setToken(token);
       */
        navigate("/me")
    } catch (err: any) {
      console.error(err);
      setError(err.message || "INVALID_CREDENTIALS");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-5 border-2 border-gray-500 rounded-md p-5 w-80">
          <h1 className="text-center text-2xl font-bold text-blue-900">
            Login
          </h1>

          {error && <p className="text-red-600 text-sm text-center">{error}</p>}

          <div className="flex flex-col">
            <label className="text-xl font-bold">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="border-2 p-1 border-black rounded-md"
              placeholder="Email"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xl font-bold">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="border-2 p-1 border-black rounded-md"
              placeholder="Password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 border-2 rounded-xl p-1 bg-blue-600 text-white disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
