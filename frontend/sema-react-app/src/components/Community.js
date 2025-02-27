import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getForums } from "../services/forumService";
import "./Community.css";

// 📸 Import Images
import dep1 from "../assets/dep1.jpg";
import dep2 from "../assets/dep2.jpg";
import dep3 from "../assets/dep3.jpg";
import dep4 from "../assets/dep4.jpg";
import dep5 from "../assets/dep5.jpg";


// 🏷️ Map forums to images
const forumImages = {
  "Tech Talk": dep1,
  "Health & Wellness": dep2,
  "Gaming Zone": dep3,
  "Business Hub": dep4,
  "Education & Learning": dep5,
  
};

// Function to get an image based on forum name
const getForumImage = (forumName) => forumImages[forumName] || dep1; // Default image

const Community = () => {
  const [forums, setForums] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getForums()
      .then((response) => {
        setForums(response.data.length ? response.data : [
          {
            id: "default",
            name: "General Discussion",
            description: "A place to talk about everything!",
            visibility: "public",
          },
          {
            id: "mothers",
            name: "MOTHERS",
            description: "A forum for mothers to share experiences and support each other.",
            visibility: "public",
          },
          {
            id: "siastas",
            name: "SIASTAS",
            description: "A community for women to empower and uplift each other.",
            visibility: "public",
          }
        ]);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching forums:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="community-container">
      <h1>Community</h1>
      <p>Join a forum and start discussing!</p>

      {loading ? (
        <p>Loading forums...</p>
      ) : forums.length === 0 ? (
        <p>No forums available. <Link to="/dashboard/create-forum">Create one!</Link></p>
      ) : (
        <div className="forum-list">
          {forums.map((forum) => (
            <div className="forum-card" key={forum.id}>
              <img src={getForumImage(forum.name)} alt={forum.name} className="forum-image" />
              <h3>{forum.name}</h3>
              <p>{forum.description}</p>
              <p className="visibility">{forum.visibility.toUpperCase()}</p>
              <Link to={`/forums/${forum.id}`} className="join-button">
                View Forum
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Community;
