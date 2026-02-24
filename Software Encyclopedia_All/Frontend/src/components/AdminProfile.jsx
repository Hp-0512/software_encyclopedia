// src/components/AdminProfile.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../CSS/AdminProfile.css";

export default function AdminProfile() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const fetchAdminProfile = async () => {
    try {
      const res = await axios.get(
        "http://software-encyclopedia-1.onrender.com/api/adminprofile",
      );
      setAdmin(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setLoading(false);
    }
  };
  const navigate = useNavigate();

  const handleLogout = () => {
    // 1️⃣ Clear authentication data
    localStorage.removeItem("authToken"); // or "user"
    localStorage.removeItem("role");

    // 2️⃣ Redirect to Auth page
    navigate("/");
  };

  if (loading) {
    return <div className="profile-container">Loading profile...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-avatar">
          {admin?.name?.charAt(0).toUpperCase()}
        </div>

        <h2 className="profile-name">{admin?.name}</h2>
        <p className="profile-email">{admin?.email}</p>
        <p className="profile-role">Administrator</p>

        <div className="profile-actions">
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
