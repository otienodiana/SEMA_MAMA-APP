import React from "react";
import { Outlet } from "react-router-dom";
import "./momDashboard.css"; 

function MomLayout() {
  return (
    <div className="mom-dashboard-container">
      <header className="mom-dashboard-header">Community Dashboard</header>

      <nav className="mom-dashboard-nav">
        <ul>
          <li><Link to="/dashboard/mom/profile">Profile</Link></li>
          <li><Link to="/dashboard/mom/community">Community</Link></li>
          <li><Link to="/dashboard/mom/resources">Resources</Link></li>
          <li><Link to="/dashboard/mom/settings">Settings</Link></li>
          <li><Link to="/dashboard/mom/appointments">Appointments</Link></li>
          <li><Link to="/dashboard/mom/logout">Logout</Link></li>
        </ul>
      </nav>

      <div className="mom-dashboard-content">
        <Outlet />
      </div>
    </div>
  );
}

export default MomLayout;
