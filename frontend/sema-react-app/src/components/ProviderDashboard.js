import React from "react";
import { Outlet, Link } from "react-router-dom";
import "./providerDashboard.css"; // ✅ Import the CSS file

function ProviderDashboard() {
  return (
    <div className="provider-dashboard-container">
      <header className="provider-dashboard-header">
        Welcome to Healthcare Provider Dashboard
      </header>

      <nav className="provider-dashboard-nav">
        <ul>
          <li><Link to="analytics">Analytics</Link></li>
          <li><Link to="profile">Profile</Link></li>
          <li><Link to="educational-contents">Educational Contents</Link></li>
          <li><Link to="logout">Logout</Link></li>
        </ul>
      </nav>

      <div className="provider-dashboard-content">
        <Outlet />
      </div>
    </div>
  );
}

export default ProviderDashboard;
