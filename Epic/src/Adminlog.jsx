import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/AdminLogin.css";

const AdminLogin = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get("http://localhost:5000/data"); // Your admin JSON endpoint
      const admins = res.data;

      const foundAdmin = admins.find(
        (admin) =>
          admin.username === form.username && admin.password === form.password
      );

      if (foundAdmin) {
        alert(`Welcome ${foundAdmin.username}`);
        navigate("/dashboard"); // Navigate to dashboard/admin panel
      } else {
        alert("Invalid Credentials");
      }
    } catch (err) {
      console.error("Error fetching admin data:", err);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-message">Hello Admin!</div>
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
