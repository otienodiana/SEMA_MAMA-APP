import React from "react";
import "./EducationalContents.css"; // Import the CSS file

const EducationalContents = () => {
  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      

      {/* Main Content */}
      <div className="main-content">
        <h1>📚 Educational Contents</h1>
        <p>Welcome to the Educational Content section. Here, you will find useful resources and articles.</p>

        {/* Example Content */}
        <div className="content-card">
          <h3>Maternal Health Tips</h3>
          <p>Learn about the best practices for a healthy pregnancy...</p>
          <button className="read-more-btn">Read More</button>
        </div>

        <div className="content-card">
          <h3>Newborn Care</h3>
          <p>Essential tips for taking care of a newborn...</p>
          <button className="read-more-btn">Read More</button>
        </div>
      </div>
    </div>
  );
};

export default EducationalContents;
