import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import axios from "axios";
import "./EducationalContents.css";

const ContentsPage = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Check if user is authenticated
  const [uploading, setUploading] = useState(false); // For tracking file upload status
  const [selectedResource, setSelectedResource] = useState(null); // ✅ Added for viewing
  const navigate = useNavigate(); // ✅ Initialize 

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      const fetchResources = async () => {
        try {
          const response = await axios.get("http://localhost:8000/api/content/contents/", {
            headers: { Authorization: `Bearer ${token}` },
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
      setError("Repeat");
      setLoading(false);
    }
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access");

    if (!token) {
      setError("You are not authenticated.");
      return;
    }

    const formData = new FormData();
    const fileInput = e.target.file;
    if (!fileInput.files.length) {
      setError("Please select a file.");
      return;
    }

    formData.append("file", fileInput.files[0]);
    formData.append("title", e.target.title.value.trim());
    formData.append("description", e.target.description.value.trim());
    formData.append("content_type", e.target.content_type.value);

    setUploading(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/content/contents/upload/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setResources((prevResources) => [...prevResources, response.data]);
      alert("File uploaded successfully!");
    } catch (err) {
      setError(err.response?.data?.detail || "Error uploading the file.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("access");
    try {
      await axios.delete(`http://localhost:8000/api/content/contents/${id}/delete/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResources(resources.filter((resource) => resource.id !== id));
      alert("Resource deleted successfully!");
    } catch (err) {
      setError("Error deleting the resource.");
    }
  };

  const handleView = async (id) => {
    try {
      const token = localStorage.getItem("access");
      const response = await axios.get(`http://localhost:8000/api/content/contents/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedResource(response.data);
      navigate(`/content/${id}`); // Navigate to the content detail page
    } catch (err) {
      setError("Error fetching content details.");
    }
  };

  const handleCloseView = () => {
    setSelectedResource(null);
  };

  // ✅ Moved inside `ContentsPage`
  const handleUpdate = async (id) => {
    const token = localStorage.getItem("access");
    const resourceToUpdate = resources.find((res) => res.id === id);
    if (!resourceToUpdate) {
      alert("Resource not found.");
      return;
    }

    const newTitle = prompt("Enter new title:", resourceToUpdate.title);
    const newDescription = prompt("Enter new description:", resourceToUpdate.description);

    if (!newTitle || !newDescription) {
      alert("Title and description cannot be empty.");
      return;
    }

    const updatedData = { title: newTitle, description: newDescription };

    try {
      const response = await axios.patch(
        `http://localhost:8000/api/content/contents/${id}/`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setResources(resources.map((res) => (res.id === id ? response.data : res)));
      alert("Resource updated successfully!");
    } catch (err) {
      alert(`Failed to update resource: ${JSON.stringify(err.response?.data)}`);
    }
  };

  // ✅ Moved inside `ContentsPage`
  const handleDownload = async (fileUrl, fileName) => {
    try {
      const absoluteUrl = fileUrl.startsWith("http") ? fileUrl : `http://localhost:8000${fileUrl}`;
      const response = await axios.get(absoluteUrl, {
        responseType: "blob",
        headers: { "Content-Type": "application/octet-stream" },
      });

      const blob = new Blob([response.data]);
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      alert("Failed to download file.");
    }
  };

  return (
    <div className="content-page">
      
      <h1>SEMAmama Resources</h1>    
       


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

              <button onClick={() => handleDownload(resource.file, resource.title)}>Download</button>
              <button onClick={() => handleView(resource.id)}>View</button>
              <button onClick={() => handleUpdate(resource.id)}>Update</button>
              <button onClick={() => handleDelete(resource.id)}>Delete</button>
            </div>
          ))}
        </div>
      )}

      {/* ✅ Content Details Section */}
      {selectedResource && (
        <div className="content-details">
          <h2>{selectedResource.title}</h2>
          <p>{selectedResource.description}</p>

          {selectedResource.content_type === "video" && <video src={selectedResource.file} controls />}
          {selectedResource.content_type === "image" && <img src={selectedResource.file} alt={selectedResource.title} />}
          {selectedResource.content_type === "document" && (
            <a href={selectedResource.file} download>
              Download Document
            </a>
          )}

          <button onClick={handleCloseView}>Close</button>
        </div>
      )}

      {/* Upload Section */}
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
          <button type="submit" disabled={uploading}>{uploading ? "Uploading..." : "Upload"}</button>
        </form>
      </div>
    </div>
  );
};

export default ContentsPage;
