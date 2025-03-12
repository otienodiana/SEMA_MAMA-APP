import React from "react";
import { Outlet, Link } from "react-router-dom";
import "./momDashboard.css"; // ✅ Import the CSS file
import MomAppointments from "./MomAppointments";


function MomDashboard() {
  return (
    <div className="mom-dashboard-container">
      <header className="mom-dashboard-header">Community Dashboard</header>

      <nav className="mom-dashboard-nav">
        <ul>
          <li><Link to="profile">Profile</Link></li>
          <li><Link to="community">Community</Link></li>
          <li><Link to="resources">Resources</Link></li>
          
          <li><Link to="Settings">Settings</Link></li>
          <li><Link to="appointments">MomAppointments</Link></li>
          <li><Link to="logout">Logout</Link></li>
        </ul>
      </nav>

      <div className="mom-dashboard-content">
        <Outlet />
      </div>
    </div>
  );
}

export default MomDashboard;
