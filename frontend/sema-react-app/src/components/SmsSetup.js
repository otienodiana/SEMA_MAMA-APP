import React from "react";

import "./SmsSetup.css"; // Import the CSS file

const SmsSetup = () => {
  return (
    <div className="dashboard-container">
      {/* Sidebar */}
    

      {/* Main Content */}
      <div className="main-content">
        <h1>✉️ SMS Setup</h1>
        <p>Configure your SMS settings below:</p>

        <form className="sms-form">
          <label>SMS Gateway API Key:</label>
          <input type="text" placeholder="Enter API Key" />

          <label>Sender ID:</label>
          <input type="text" placeholder="Enter Sender ID" />

          <label>Default SMS Message:</label>
          <textarea placeholder="Enter default message"></textarea>

          <button type="submit" className="save-btn">Save Settings</button>
        </form>
      </div>
    </div>
  );
};

export default SmsSetup;
