import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // <-- Import useNavigate
import API from "../api/api";
import "../css/File.css";

const File = () => {
  const navigate = useNavigate(); // <-- Initialize navigate
  const [files, setFiles] = useState([]);
  const [newFile, setNewFile] = useState({ fileName: "", description: "" });
  const [editingFile, setEditingFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showFormPanel, setShowFormPanel] = useState(false);

  // Fetch files
  const fetchFiles = async () => {
    try {
      setLoading(true);
      const res = await API.get("/files"); // API endpoint
      let data = res.data;
      if (Array.isArray(data[0])) data = data[0];
      const mappedFiles = data.map((f) => ({
        id: f.documentId,
        fileName: f.title,
        description: `Author: ${f.author.name}, Role: ${f.author.role}`,
      }));
      setFiles(mappedFiles);
    } catch (err) {
      console.error("Error fetching files:", err);
      alert("Failed to fetch files.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  // Add file
  const addFile = (e) => {
    e.preventDefault();
    const id = `DOC-${Date.now()}`;
    const file = { id, ...newFile };
    setFiles((prev) => [...prev, file]);
    setNewFile({ fileName: "", description: "" });
    setShowFormPanel(false);
  };

  // Delete file
  const deleteFile = (id) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  // Start editing
  const startEditing = (file) => {
    setEditingFile(file);
    setShowFormPanel(true);
  };

  // Update file
  const updateFile = (e) => {
    e.preventDefault();
    setFiles((prev) =>
      prev.map((f) => (f.id === editingFile.id ? editingFile : f))
    );
    setEditingFile(null);
    setShowFormPanel(false);
  };

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div
          className="sidebar-title"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/dashboard")} // <-- Navigate to admin panel
        >
          Admin Panel
        </div>
        <ul>
          <li
            onClick={() => {
              setShowFormPanel(false);
              setEditingFile(null);
            }}
          >
            File List
          </li>
          <li
            onClick={() => {
              setShowFormPanel(true);
              setEditingFile(null);
            }}
          >
            Add File
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {loading && <div className="loading-bar">Loading...</div>}

        {/* Show Table */}
        {!showFormPanel && (
          <>
            <h2>All Files</h2>
            <div style={{ overflowX: "auto" }}>
              <table
                className="user-table"
                style={{ width: "100%", minWidth: "600px" }}
              >
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>File Name</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {files.length === 0 ? (
                    <tr>
                      <td colSpan="4">No files added yet.</td>
                    </tr>
                  ) : (
                    files.map((f) => (
                      <tr key={f.id}>
                        <td>{f.id}</td>
                        <td>{f.fileName}</td>
                        <td>{f.description}</td>
                        <td>
                          <button
                            className="edit-btn"
                            onClick={() => startEditing(f)}
                          >
                            Edit
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => deleteFile(f.id)}
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
          </>
        )}

        {/* Show Form Panel */}
        {showFormPanel && (
          <div className="form-panel">
            <h2>{editingFile ? "Edit File" : "Add New File"}</h2>
            <form
              onSubmit={editingFile ? updateFile : addFile}
              className="user-form"
            >
              <input
                type="text"
                placeholder="File Name"
                value={editingFile ? editingFile.fileName : newFile.fileName}
                onChange={(e) =>
                  editingFile
                    ? setEditingFile({ ...editingFile, fileName: e.target.value })
                    : setNewFile({ ...newFile, fileName: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Description"
                value={
                  editingFile ? editingFile.description : newFile.description
                }
                onChange={(e) =>
                  editingFile
                    ? setEditingFile({
                        ...editingFile,
                        description: e.target.value,
                      })
                    : setNewFile({ ...newFile, description: e.target.value })
                }
                required
              />
              <button type="submit">
                {editingFile ? "Update File" : "Add File"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditingFile(null);
                  setShowFormPanel(false);
                }}
              >
                Cancel
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default File;
