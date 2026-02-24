import React from "react";
import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";
import "../CSS/AdminHome.css";
import { Link, Outlet } from "react-router-dom";

const AdminHome = () => {
  return (
    <div className="admin-layout">
      <AdminSidebar />

      <div className="admin-main">
        <AdminHeader />

        {/* ONLY child pages render here */}
        <Outlet />
      </div>
    </div>
  );
};

export default AdminHome;
