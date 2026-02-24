// import React from "react";
// import { useLocation } from "react-router-dom";
// import "../CSS/AdminHeader.css";

// const AdminHeader = () => {
//   const location = useLocation();

//   const pageTitles = {
//     "/admin": "Overview",
//     "/admin/manage-users": "User Accounts",
//     "/admin/manage-categories": "Category Management",
//     "/admin/manage-softwares": "Software Directory",
//     "/admin/managereviews": "REview Moderation",
//     "/admin/manageresult": "Quiz Analytics",
//     "/admin/community": "Community Hub",
//   };

//   const title = pageTitles[location.pathname] || "Dashboard";

//   return (
//     <div className="admin-header">
//       <h3>{title}</h3>
//       <span>Admin</span>
//     </div>
//   );
// };

// export default AdminHeader;

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../CSS/AdminHeader.css";

const AdminHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState("");

  const pageTitles = {
    "/admin": "Overview",
    "/admin/manage-users": "User Accounts",
    "/admin/manage-categories": "Category Management",
    "/admin/manage-softwares": "Software Directory",
    "/admin/managereviews": "Review Moderation",
    "/admin/manageresult": "Quiz Analytics",
    "/admin/community": "Community Hub",
  };

  const title = pageTitles[location.pathname] || "Admin Profile";

  useEffect(() => {
    fetchAdmin();
  }, []);

  const fetchAdmin = async () => {
    try {
      const res = await axios.get(
        "https://software-encyclopedia-1.onrender.com/api/adminprofile",
      );
      setAdminName(res.data.name);
    } catch (error) {
      console.error("Error fetching admin name:", error);
    }
  };

  return (
    <div className="admin-header">
      <h3>{title}</h3>

      <div
        className="admin-info"
        onClick={() => navigate("/admin/adminprofile")}
      >
        <div className="admin-avatar">
          {adminName ? adminName.charAt(0).toUpperCase() : "A"}
        </div>
        <span className="admin-name">{adminName || "Loading..."}</span>
      </div>
    </div>
  );
};

export default AdminHeader;
