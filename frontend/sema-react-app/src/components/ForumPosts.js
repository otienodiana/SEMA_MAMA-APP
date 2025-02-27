import React, { useEffect, useState } from "react";
import { getForums } from "../services/forumService";
import { Link } from "react-router-dom";
import "./Forum.css";

const Forum = () => {
  const [forums, setForums] = useState([]);

  useEffect(() => {
    getForums()
      .then((response) => setForums(response.data))
      .catch((error) => console.error("Error fetching forums:", error));
  }, []);

  return (
    <div className="forum-container">
      <div className="main-content">
        <h1>Community Forum</h1>
        <p>Discuss topics, ask questions, and share experiences.</p>

        <ul>
          {forums.map((forum) => (
            <li key={forum.id}>
              <Link to={`/dashboard/forum/${forum.id}/posts`}>{forum.name}</Link> {/* ✅ Fixed route */}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Forum;
