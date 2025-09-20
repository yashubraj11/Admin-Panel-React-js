// src/components/AdminPanel.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/Adminpannel.css";
import { useNavigate } from "react-router-dom";

const API = "https://dummyjson.com/users"; // DummyJSON API

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [activePage, setActivePage] = useState("users");
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    passwords: "",
    phonenumber: "",
    date_of_birth: "",
  });
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize navigate

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}?limit=20`);
      const mappedUsers = res.data.users.map((u) => ({
        id: u.id,
        username: u.firstName + " " + u.lastName,
        email: u.email,
        passwords: "******",
        phonenumber: u.phone,
        date_of_birth: u.birthDate,
      }));
      setUsers(mappedUsers);
    } catch (err) {
      console.error("Error fetching users:", err);
      alert("Unable to fetch users from DummyJSON.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Add user
  const addUser = (e) => {
    e.preventDefault();
    const id = users.length ? users[users.length - 1].id + 1 : 1;
    const user = { ...newUser, id };
    setUsers((prev) => [...prev, user]);
    setNewUser({
      username: "",
      email: "",
      passwords: "",
      phonenumber: "",
      date_of_birth: "",
    });
    setActivePage("users");
  };

  // Delete user
  const deleteUser = (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  // Start editing
  const startEditing = (user) => {
    setEditingUser({ ...user });
    setActivePage("addUser");
  };

  // Update user
  const updateUser = (e) => {
    e.preventDefault();
    setUsers((prev) =>
      prev.map((u) => (u.id === editingUser.id ? editingUser : u))
    );
    setEditingUser(null);
    setActivePage("users");
  };

  // Helpers
  const currentVal = (field) =>
    editingUser ? editingUser[field] ?? "" : newUser[field] ?? "";

  const handleChange = (field, value) => {
    if (editingUser) {
      setEditingUser((prev) => ({ ...prev, [field]: value }));
    } else {
      setNewUser((prev) => ({ ...prev, [field]: value }));
    }
  };

  // Logout function
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      navigate("/"); // Navigate to AdminLogin page
    }
  };

  return (
    <div className="admin-container">
      <aside className="sidebar">
        <h2 className="sidebar-title">Admin Panel</h2>
        <ul>
          <li
            className={activePage === "users" ? "active" : ""}
            onClick={() => {
              setActivePage("users");
              setEditingUser(null);
            }}
          >
            User Management
          </li>
          <li
            className={activePage === "addUser" ? "active" : ""}
            onClick={() => {
              setActivePage("addUser");
              setEditingUser(null);
            }}
          >
            Add User
          </li>
          <li
            className={activePage === "fileView" ? "active" : ""}
            onClick={() => navigate("/file")} // Navigate to File.jsx
          >
            File View
          </li>
          <li onClick={handleLogout} style={{ background: "#ff4b5c" }}>
            Logout
          </li>
        </ul>
      </aside>

      <main className="main-content">
        {loading && <div className="loading-bar">Loading...</div>}

        {activePage === "users" && (
          <div>
            <h2>User Management</h2>
            <div className="table-wrap">
              <table className="user-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Password</th>
                    <th>Phone</th>
                    <th>DOB</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="7">No users found.</td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u.id}>
                        <td>{u.id}</td>
                        <td>{u.username}</td>
                        <td>{u.email}</td>
                        <td>{u.passwords}</td>
                        <td>{u.phonenumber}</td>
                        <td>{u.date_of_birth}</td>
                        <td>
                          <button
                            className="edit-btn"
                            onClick={() => startEditing(u)}
                          >
                            Edit
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => deleteUser(u.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activePage === "addUser" && (
          <div>
            <h2>{editingUser ? "Edit User" : "Add User"}</h2>
            <form
              onSubmit={editingUser ? updateUser : addUser}
              className="user-form"
            >
              <input
                type="text"
                placeholder="Username"
                value={currentVal("username")}
                onChange={(e) => handleChange("username", e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={currentVal("email")}
                onChange={(e) => handleChange("email", e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={currentVal("passwords")}
                onChange={(e) => handleChange("passwords", e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Phone Number"
                value={currentVal("phonenumber")}
                onChange={(e) => handleChange("phonenumber", e.target.value)}
                required
              />
              <input
                type="date"
                value={currentVal("date_of_birth")}
                onChange={(e) => handleChange("date_of_birth", e.target.value)}
                required
              />

              <div className="form-actions">
                <button type="submit">
                  {editingUser ? "Update User" : "Add User"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingUser(null);
                    setNewUser({
                      username: "",
                      email: "",
                      passwords: "",
                      phonenumber: "",
                      date_of_birth: "",
                    });
                    setActivePage("users");
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;
