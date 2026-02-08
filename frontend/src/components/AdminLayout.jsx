import React from "react";
import AdminSidebar from "./AdminSidebar";
import "../pages/AdminDashboard.css";

const AdminLayout = ({ children, activePage }) => {
  return (
    <div className="admin-layout">
      <AdminSidebar activePage={activePage} />
      <main className="admin-content">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
