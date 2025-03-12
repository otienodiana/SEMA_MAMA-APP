import React from "react";
import { Outlet, Link } from "react-router-dom";
import "./providerDashboard.css"; // ✅ Import CSS file

function ProviderDashboard() {
  return (
    <div className="provider-dashboard-container">
      <header className="provider-dashboard-header">Healthcare Provider Dashboard</header>

      <nav className="provider-dashboard-nav">
        <ul>
          <li><Link to="">Dashboard</Link></li> {/* Default Route */}
          <li><Link to="profile">Profile</Link></li>
          <li><Link to="/dashboard/provider/appointments">Appointments</Link></li>
          
          <li><Link to="educational-contents">Health Corner</Link></li>
          <li><Link to="community">Community</Link></li>
          <li><Link to="settings">Settings</Link></li>
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
