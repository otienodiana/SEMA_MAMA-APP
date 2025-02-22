import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import "./Dashboard.css";

const DashboardHome = () => {
  return (
    <div>
      <h1>Welcome to Your Dashboard</h1>
      <p>Here you can view your stats, appointments, and more.</p>
    </div>
  );
};

const Dashboard = () => {
  const location = useLocation();

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <nav className="sidebar">
        <h2 className="logo">Sema Mama</h2>
        <ul className="nav-list">
          <li className={location.pathname === "/dashboard" ? "active" : ""}>
            <Link to="/dashboard">🏠 Home</Link>
          </li>
          <li className={location.pathname === "/dashboard/profile" ? "active" : ""}>
            <Link to="/dashboard/profile">👤 Profile</Link>
          </li>
          <li className={location.pathname === "/dashboard/settings" ? "active" : ""}>
            <Link to="/dashboard/settings">⚙️ Settings</Link>
          </li>
          <li className={location.pathname === "/dashboard/appointments" ? "active" : ""}>
            <Link to="/dashboard/appointments">📅 Appointments</Link>
          </li>
          <li className={location.pathname === "/dashboard/analytics" ? "active" : ""}>
            <Link to="/dashboard/analytics">📊 Analytics</Link>
          </li>
          <li className={location.pathname === "/dashboard/sms-setup" ? "active" : ""}>
            <Link to="/dashboard/sms-setup">✉️ SMS Setup</Link>
          </li>
          <li className={location.pathname === "/dashboard/forum" ? "active" : ""}>
            <Link to="/dashboard/forum">💬 Forum</Link>
          </li>
          <li className={location.pathname === "/dashboard/educational-contents" ? "active" : ""}>
            <Link to="/dashboard/educational-contents">📚 Educational Contents</Link>
          </li>
          <li className={location.pathname === "/dashboard/logout" ? "active" : ""}>
            <Link to="/dashboard/logout">🚪 Logout</Link>
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <div className="main-content">
        {location.pathname === "/dashboard" ? <DashboardHome /> : <Outlet />}
      </div>
    </div>
  );
};

export default Dashboard;
