import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api.services";

interface registrationFormDTO {
  name: string;
  email: string;
  password: string;
}

export default function RegistrationPage() {
  const [form, setForm] = useState<registrationFormDTO>({
    name: "",
    email: "",
    password: "",
  });

  //Navigation stuff
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // 🔥 THIS is what stops POST /register
    setLoading(true);
    setError(null)
    try {
      await api.post("/auth/register", form);
      setSuccess(true);
      setLoading(false);
      
      let seconds = 5
      setCountdown(seconds);
      const interval = setInterval(() => {
        seconds --;
        setCountdown(seconds);

        if(seconds === 0){
          clearInterval(interval)
          navigate("/login")
        }
      },1000)

      console.log("Form data:", JSON.stringify(form, null, 2));
      

    } catch (error: any) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-center h-screen ">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-5 border-2 border-gray-500 rounded-md rounded-3 p-5">
            <h1 className="text-center text-2xl fw-bold text-blue-900">
              Registration Form
            </h1>
            <div className="flex flex-col">
              <label className="text-xl fw-bold">Name</label>
              <input
                type="text"
                value={form.name}
                name="name"
                onChange={handleChange}
                className="border-2 p-1 border-black rounded-md"
                placeholder="Enter Name.."
              />
            </div>

            <div className="flex flex-col">
              <label className="text-xl fw-bold">Email</label>
              <input
                type="email"
                value={form.email}
                name="email"
                onChange={handleChange}
                className="border-2 p-1 border-black rounded-md"
                placeholder="Email"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-xl fw-bold">Password</label>
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
              className="mt-4 border-2 rounded-xl p-1 bg-blue-600 text-white"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
