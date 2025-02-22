import React from "react";
import "./Forum.css"; // Import CSS file

const Forum = () => {
  return (
    <div className="forum-container">
      {/* Sidebar */}
      

      {/* Main Content */}
      <div className="main-content">
        <h1>Community Forum</h1>
        <p>Discuss topics, ask questions, and share experiences.</p>

        {/* Example Forum Posts */}
        <div className="post">
          <h3>How to manage pregnancy stress?</h3>
          <p><strong>User123:</strong> I feel overwhelmed, any tips?</p>
          <button className="button">Reply</button>
        </div>

        <div className="post">
          <h3>Best nutrition tips during pregnancy?</h3>
          <p><strong>User456:</strong> What are some good foods to eat?</p>
          <button className="button">Reply</button>
        </div>
      </div>
    </div>
  );
};

export default Forum;
