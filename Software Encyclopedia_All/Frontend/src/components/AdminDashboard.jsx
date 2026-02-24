import React from "react";
import { Link } from "react-router-dom";
import "../CSS/Dashboard.css";

function Dashboard() {
  return (
    <div className="admin-cards">
      <div className="admin-card">
        <h3>User Accounts 👥</h3>
        <p>Monitor, manage and control user access across the platform.</p>
        <Link to="manage-users" className="open-btn">
          User Accounts
        </Link>
      </div>

      <div className="admin-card">
        <h3>Category Management 📁</h3>
        <p>Maintain structured software classifications.</p>
        <Link to="manage-categories" className="open-btn">
          Edit Categories
        </Link>
      </div>

      <div className="admin-card">
        <h3>Software Directory 💻 </h3>
        <p>Manage verified software listings.</p>
        <Link to="manage-softwares" className="open-btn">
          View Directory
        </Link>
      </div>

      <div className="admin-card">
        <h3>Review Moderation ⭐ </h3>
        <p>Analyze and moderate user feedback.</p>

        <Link to="managereviews" className="open-btn">
          Moderate Reviews
        </Link>
      </div>

      <div className="admin-card">
        <h3>Quiz Analytics 🧠 </h3>
        <p>Track assessment performance metrics.</p>

        <Link to="manageresult" className="open-btn">
          View Analytics
        </Link>
      </div>
      <div className="admin-card">
        <h3>Community Hub 🌐 </h3>
        <p>Oversee community engagement and discussions.</p>

        <Link to="community" className="open-btn">
          Manage Discussions
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;
