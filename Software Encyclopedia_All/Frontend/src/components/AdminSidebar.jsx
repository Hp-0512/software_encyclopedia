import React, { useState } from "react";
import "../CSS/AdminSidebar.css";
import { Link, useNavigate } from "react-router-dom";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button className="menu-toggle" onClick={() => setOpen(!open)}>
        ☰
      </button>

      <div className={`admin-sidebar ${open ? "active" : ""}`}>
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
            <Link to="/admin/manageresult">🧠 Quiz Analytics</Link>
          </li>

          <li>
            <Link to="/admin/community">🌐 Community Hub</Link>
          </li>

          <li className="logout" onClick={handleLogout}>
            🚪 Sign Out
          </li>
        </ul>
      </div>
    </>
  );
};

export default AdminSidebar;
