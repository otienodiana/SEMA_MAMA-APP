import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import axios from "axios";
import "./EducationalContents.css";

const ContentsPage = () => {
  const { t } = useTranslation();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Check if user is authenticated
  const [uploading, setUploading] = useState(false); // For tracking file upload status
  const [selectedResource, setSelectedResource] = useState(null); // ✅ Added for viewing
  const navigate = useNavigate(); // ✅ Initialize
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      const fetchResources = async () => {
        try {
          const response = await axios.get(
            "http://localhost:8000/api/content/contents/",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
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

  useEffect(() => {
    const savedFavorites = localStorage.getItem("favoriteResources");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("favoriteResources", JSON.stringify(favorites));
  }, [favorites]);

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
      await axios.delete(
        `http://localhost:8000/api/content/contents/${id}/delete/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setResources(resources.filter((resource) => resource.id !== id));
      alert("Resource deleted successfully!");
    } catch (err) {
      setError("Error deleting the resource.");
    }
  };

  const handleView = async (id) => {
    try {
      const token = localStorage.getItem("access");
      const response = await axios.get(
        `http://localhost:8000/api/content/contents/${id}/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSelectedResource(response.data);
      navigate(`/content/${id}`); // Navigate to the content detail page
    } catch (err) {
      setError("Error fetching content details.");
    }
  };

  const handleCloseView = () => {
    setSelectedResource(null);
  };

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

  const toggleFavorite = (resource) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.some(fav => fav.id === resource.id)) {
        return prevFavorites.filter(fav => fav.id !== resource.id);
      } else {
        return [...prevFavorites, resource];
      }
    });
  };

  const filteredResources = resources.filter(resource => {
    const searchContent = `${resource.title} ${resource.description}`.toLowerCase();
    return searchContent.includes(searchQuery.toLowerCase());
  });

  const displayedResources = showFavorites 
    ? filteredResources.filter(resource => favorites.some(fav => fav.id === resource.id))
    : filteredResources;

  return (
    <div className="content-page">
      <h1>{t('educational.title')}</h1>

      <div className="search-and-filter">
        <input
          type="text"
          placeholder={t('educational.searchPlaceholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <button 
          className={`filter-button ${showFavorites ? 'active' : ''}`}
          onClick={() => setShowFavorites(!showFavorites)}
        >
          {showFavorites ? t('educational.showFavorites') : t('educational.showAll')}
        </button>
      </div>

      <div className="content-layout">
        {/* Resources Section */}
        {loading ? (
          <p>Loading resources...</p>
        ) : error ? (
          <p>{error}</p>
        ) : displayedResources.length === 0 ? (
          <p>No resources found. {showFavorites ? 'No favorites yet!' : 'Try a different search term.'}</p>
        ) : (
          <div className="resources-list">
            {displayedResources.map((resource) => (
              <div className="resource-card" key={resource.id}>
                <h3>{resource.title}</h3>
                <p>{resource.description}</p>
                {resource.content_type === "video" && <video src={resource.file} controls />}
                {resource.content_type === "image" && <img src={resource.file} alt={resource.title} />}
                <div className="resource-actions">
                  <button onClick={() => handleDownload(resource.file, resource.title)}>Download</button>
                  <button onClick={() => handleView(resource.id)}>View</button>
                  <button onClick={() => handleUpdate(resource.id)}>Update</button>
                  <button onClick={() => handleDelete(resource.id)}>Delete</button>
                  <button 
                    className={`favorite-button ${favorites.some(fav => fav.id === resource.id) ? 'active' : ''}`}
                    onClick={() => toggleFavorite(resource)}
                  >
                    {favorites.some(fav => fav.id === resource.id) ? '★' : '☆'}
                  </button>
                </div>
              </div>
            ))}
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
    </div>
  );
};

export default ContentsPage;
