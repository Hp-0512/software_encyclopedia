import React from "react";
import "../CSS/AdminSidebar.css";
import { Link, useNavigate } from "react-router-dom";

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 1️⃣ Clear authentication data
    localStorage.removeItem("authToken"); // or "user"
    localStorage.removeItem("role");

    // If using Firebase later:
    // signOut(auth);

    // 2️⃣ Redirect to Auth page
    navigate("/");
  };

  return (
    <div className="admin-sidebar">
      <h2>Admin Panel</h2>

      <ul>
        <li>
          <Link to="/admin">📊 Overview</Link>
        </li>

        <li>
          <Link to="/admin/manage-users">👥 User Management</Link>
        </li>

        <li>
          <Link to="/admin/manage-categories">🗂 Category Management</Link>
        </li>

        <li>
          <Link to="/admin/manage-softwares">💻 Software Directory</Link>
        </li>

        <li>
          <Link to="/admin/managereviews">⭐ Review Moderation</Link>
        </li>
        <li>
          <Link to="/admin/manageresult">🧠 Quiz Analytics </Link>
        </li>
        <li>
          <Link to="/admin/community">🌐 Community Hub</Link>
        </li>

        <li className="logout" onClick={handleLogout}>
          🚪 Sign Out
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
