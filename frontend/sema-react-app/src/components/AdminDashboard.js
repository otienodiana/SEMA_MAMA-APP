import React from "react";
import { Outlet, Link } from "react-router-dom";
import "./AdminDashboard.css";
const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <nav className="admin-sidebar">
        <ul>
          <li>
            <Link to="/dashboard/admin">Analytics</Link>
          </li>
          <li>
            <Link to="/dashboard/admin/profile">Profile</Link>
          </li>
          <li>
            <Link to="/dashboard/admin/settings">Settings</Link>
          </li>
          <li>
            <Link to="/dashboard/admin/appointments">Appointments</Link>
          </li>
          <li>
            <Link to="/dashboard/admin/sms-setup">SMS Setup</Link>
          </li>
          <li>
            <Link to="/dashboard/admin/community">Community</Link>
          </li>
          <li>
            <Link to="/dashboard/admin/admin/community">Admin Community</Link>
          </li>
          <li>
            <Link to="/dashboard/admin/educational-contents">Educational Contents</Link>
          </li>
          <li>
            <Link to="/dashboard/admin/logout">Logout</Link>
          </li>
        </ul>
      </nav>
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;
