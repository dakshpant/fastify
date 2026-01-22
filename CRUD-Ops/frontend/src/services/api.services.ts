// const API_URL = import.meta.env.VITE_API_URL;

// export const api = async (
//   endpoint: string,
//   options: RequestInit = {}
// ) => {
//   const token = localStorage.getItem("access_token");

//   const response = await fetch(`${API_URL}${endpoint}`, {
//     ...options,
//     headers: {
//       "Content-Type": "application/json",
//       ...(token && { Authorization: `Bearer ${token}` }),
//       ...options.headers,
//     },
//   });

//   let data: any = null;
//   const text = await response.text();

//   if (text) {
//     data = JSON.parse(text);
//   }

//   if (!response.ok) {
//     throw new Error(data?.message || "API_ERROR");
//   }

//   return data;
// };

//With axios
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message || "API_ERROR";
    return Promise.reject(new Error(message));
  }
);
