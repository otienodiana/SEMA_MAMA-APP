import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ContentDetail.css"; // Add styles if needed

const ContentDetail = () => {
  const { id } = useParams(); // Get the content ID from the URL
  const navigate = useNavigate();
  const [content, setContent] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContent = async () => {
      const token = localStorage.getItem("access");

      if (!token) {
        alert("Session expired. Please log in again.");
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(`http://localhost:8000/api/content/contents/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Fetched content:", response.data); // ✅ Debug API response
        setContent(response.data);
      } catch (err) {
        console.error("Error fetching content:", err);
        setError("Failed to load content.");
      }
    };

    fetchContent();
  }, [id, navigate]);

  if (error) return <p>{error}</p>;
  if (!content) return <p>Loading...</p>;

  // ✅ Ensure media paths are correct
  const mediaBaseURL = "http://localhost:8000"; 

  return (
    <div className="content-detail">
      <h2>{content.title}</h2>
      <p>{content.description}</p>

      {/* ✅ Render media based on content type */}
      {content.content_type === "video" && (
        <video src={`${mediaBaseURL}${content.file}`} controls />
      )}
      {content.content_type === "image" && (
        <img src={`${mediaBaseURL}${content.file}`} alt={content.title} />
      )}
      {content.content_type === "document" && (
        <a href={`${mediaBaseURL}${content.file}`} download>
          Download Document
        </a>
      )}

      <button onClick={() => navigate(-1)}>Go Back</button> {/* Back Button */}
    </div>
  );
};

export default ContentDetail;
