import React from "react";

import "./Analytics.css"; // Import the CSS file

const Analytics = () => {
  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      

      {/* Main Content */}
      <div className="main-content">
        <h1>📊 Analytics</h1>
        <p>View and analyze your app's data below:</p>

        <div className="analytics-cards">
          <div className="card">
            <h3>Total Users</h3>
            <p>1,245</p>
          </div>
          <div className="card">
            <h3>Active Users</h3>
            <p>845</p>
          </div>
          <div className="card">
            <h3>Messages Sent</h3>
            <p>10,562</p>
          </div>
          <div className="card">
            <h3>Appointments Made</h3>
            <p>670</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
