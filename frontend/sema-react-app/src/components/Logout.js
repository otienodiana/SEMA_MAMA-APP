import React from "react";
import {  useNavigate } from "react-router-dom";
import "./Logout.css"; // Import the CSS file

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user session (if using localStorage, sessionStorage, or context)
    localStorage.removeItem("userToken");
    sessionStorage.clear();

    // Redirect to login page
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      

      {/* Main Content */}
      <div className="main-content">
        <h1>🚪 Logout</h1>
        <p>Are you sure you want to log out?</p>
        <button className="logout-btn" onClick={handleLogout}>Confirm Logout</button>
      </div>
    </div>
  );
};

export default Logout;
