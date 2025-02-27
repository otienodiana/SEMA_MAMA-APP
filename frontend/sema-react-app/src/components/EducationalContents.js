import React, { useState, useEffect } from "react";
import axios from "axios";

const ContentsPage = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Check if user is authenticated
  const [uploading, setUploading] = useState(false); // For tracking file upload status

  useEffect(() => {
    // Check if the user is authenticated by checking for a token in localStorage
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      // Fetch resources (content) only if authenticated
      const fetchResources = async () => {
        try {
          const response = await axios.get("http://localhost:8000/api/contents/", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setResources(response.data);
          setLoading(false);
        } catch (err) {
          setError("Error fetching resources.");
          setLoading(false);
        }
      };

      fetchResources();
    } else {
      setError("You are not authenticated.");
      setLoading(false);
    }
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    const token = localStorage.getItem("token");

    // Append the file and other fields to FormData
    formData.append("file", e.target.file.files[0]);
    formData.append("title", e.target.title.value);
    formData.append("description", e.target.description.value);
    formData.append("content_type", e.target.content_type.value);

    setUploading(true);

    try {
      const response = await axios.post("http://localhost:8000/api/contents/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setResources([...resources, response.data]); // Add the new resource to the list
      setUploading(false);
      alert("File uploaded successfully!");
    } catch (err) {
      setUploading(false);
      setError("Error uploading the file.");
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");

    try {
      await axios.delete(`http://localhost:8000/api/contents/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Remove the deleted resource from the list
      setResources(resources.filter((resource) => resource.id !== id));
      alert("Resource deleted successfully!");
    } catch (err) {
      setError("Error deleting the resource.");
    }
  };

  const handleUpdate = (id) => {
    // Handle the update logic, could open a modal or redirect to an update page
    console.log("Update functionality is not implemented yet for resource id: ", id);
  };

  return (
    <div className="content-page">
      <h1>Manage Resources</h1>
      <p>Manage your uploaded resources here.</p>

      {loading ? (
        <p>Loading resources...</p>
      ) : error ? (
        <p>{error}</p>
      ) : resources.length === 0 ? (
        <p>No resources available. Please upload a new resource!</p>
      ) : (
        <div className="resources-list">
          {resources.map((resource) => (
            <div className="resource-card" key={resource.id}>
              <h3>{resource.title}</h3>
              <p>{resource.description}</p>
              {resource.content_type === "video" && <video src={resource.file} controls />}
              {resource.content_type === "image" && <img src={resource.file} alt={resource.title} />}
              {resource.content_type === "document" && <a href={resource.file} target="_blank" rel="noopener noreferrer">Download</a>}
              {resource.content_type === "other" && <p>File type not supported for preview</p>}

              {/* Render update and delete buttons for authenticated users */}
              <div className="resource-actions">
                <button onClick={() => handleUpdate(resource.id)}>Update</button>
                <button onClick={() => handleDelete(resource.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload section (visible for authenticated users only) */}
      <div className="upload-section">
        <h2>Upload a New Resource</h2>
        <form onSubmit={handleUpload}>
          <input type="file" name="file" required />
          <input type="text" name="title" placeholder="Title" required />
          <textarea name="description" placeholder="Description" />
          <select name="content_type">
            <option value="video">Video</option>
            <option value="document">Document</option>
            <option value="image">Image</option>
            <option value="other">Other</option>
          </select>
          <button type="submit" disabled={uploading}>
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContentsPage;
