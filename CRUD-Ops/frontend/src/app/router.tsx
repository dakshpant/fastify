import { Routes, Route, Navigate } from "react-router-dom";
import Register from "../pages/registrationPage";
import Login from "../pages/LoginPage";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

    </Routes>
  );
};

export default AppRouter;
