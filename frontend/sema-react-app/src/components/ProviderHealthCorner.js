import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import './AdminEducationalContents.css';  // Reuse the same CSS

const ProviderHealthCorner = () => {
  const { t } = useTranslation();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('created_at');
  const [filterType, setFilterType] = useState('all');
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [showDetailView, setShowDetailView] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [newFormData, setNewFormData] = useState({
    title: '',
    description: '',
    content_type: 'article',
    is_featured: false
  });

  const handleUpload = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access");
    const formData = new FormData();
    const fileInput = e.target.querySelector('input[type="file"]');
    
    if (!fileInput || !fileInput.files.length) {
      setError("Please select a file.");
      return;
    }

    formData.append("file", fileInput.files[0]);
    formData.append("title", e.target.title.value.trim());
    formData.append("description", e.target.description.value.trim());
    formData.append("content_type", e.target.content_type.value);
    formData.append("is_featured", isFeatured);
    formData.append("status", "pending");

    setUploading(true);
    setError(null);

    try {
      // Updated API endpoint
      const response = await axios.post(
        "http://localhost:8000/api/educational/submit/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          }
        }
      );

      if (response.data) {
        alert("Resource submitted for approval!");
        e.target.reset();
        setIsFeatured(false);
        setShowUploadForm(false);
        fetchResources();
      }
    } catch (err) {
      console.error("Upload error:", err.response?.data || err.message);
      setError(err.response?.data?.detail || "Failed to submit resource");
    } finally {
      setUploading(false);
    }
  };

  const fetchResources = async () => {
    const token = localStorage.getItem("access");
    try {
      // Update to use the educational content endpoint
      const response = await axios.get(
        "http://localhost:8000/api/educational/content/list/",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      console.log("Fetched resources:", response.data);
      
      // Sort resources to show most recent first and approved items at top
      const sortedResources = response.data.sort((a, b) => {
        if (a.status === 'approved' && b.status !== 'approved') return -1;
        if (a.status !== 'approved' && b.status === 'approved') return 1;
        return new Date(b.created_at) - new Date(a.created_at);
      });
      
      setResources(sortedResources);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching resources:", err);
      setError("Failed to fetch resources");
      setLoading(false);
    }
  };

  // Add auto-refresh when component mounts and every 30 seconds
  useEffect(() => {
    fetchResources();
    const interval = setInterval(fetchResources, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleView = (resource) => {
    setSelectedContent(resource);
    setShowDetailView(true);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending': return 'status-badge pending';
      case 'approved': return 'status-badge approved';
      case 'rejected': return 'status-badge rejected';
      default: return 'status-badge';
    }
  };

  const handleEdit = (content) => {
    setShowDetailView(false);
    setSelectedContent(content);
    setShowUploadForm(true);
    // Pre-fill the form data
    setNewFormData({
      title: content.title,
      description: content.description,
      content_type: content.content_type,
      is_featured: content.is_featured
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) {
      return;
    }

    const token = localStorage.getItem("access");
    try {
      // Update the API endpoint to match the backend URL
      await axios.delete(
        `http://localhost:8000/api/educational/content/${id}/`,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setShowDetailView(false);
      setSelectedContent(null);
      fetchResources(); // Refresh the list
      alert('Resource deleted successfully');
    } catch (err) {
      console.error("Delete error:", err);
      alert(err.response?.data?.error || "Failed to delete resource");
    }
  };

  const handleShare = async (content) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: content.title,
          text: content.description,
          url: window.location.href
        });
      } else {
        // Fallback for browsers that don't support Web Share API
        const shareUrl = content.file || window.location.href;
        navigator.clipboard.writeText(shareUrl);
        alert('Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Share failed:', err);
    }
  };

  // Update the isContentCreator function
  const isContentCreator = (content) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      return user && content.created_by === user.id;
    } catch (error) {
      console.error('Error checking content creator:', error);
      return false;
    }
  };

  // Update filtered resources to include status filter
  const filteredResources = resources
    .filter(resource => {
      const matchesType = filterType === 'all' || resource.content_type === filterType;
      const matchesStatus = statusFilter === 'all' || resource.status === statusFilter;
      return matchesType && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'created_at') {
        return new Date(b.created_at) - new Date(a.created_at);
      }
      return a[sortBy].localeCompare(b[sortBy]);
    });

  return (
    <div className="provider-content-wrapper">
      <div className="provider-health-container">
        <div className="header-section">
          <h2>Health Resources Management</h2>
          <button 
            className="new-upload-btn"
            onClick={() => setShowUploadForm(!showUploadForm)}
          >
            {showUploadForm ? 'Cancel Upload' : 'Submit New Resource'}
          </button>
        </div>

        {showUploadForm && (
          <div className="upload-form-section">
            <form onSubmit={handleUpload}>
              <input
                type="text"
                name="title"
                placeholder="Title"
                required
                value={newFormData.title}
                onChange={(e) => setNewFormData({ ...newFormData, title: e.target.value })}
              />
              <textarea
                name="description"
                placeholder="Description"
                required
                value={newFormData.description}
                onChange={(e) => setNewFormData({ ...newFormData, description: e.target.value })}
              />
              <select 
                name="content_type" 
                required
                value={newFormData.content_type}
                onChange={(e) => setNewFormData({ ...newFormData, content_type: e.target.value })}
              >
                <option value="article">Article</option>
                <option value="video">Video</option>
                <option value="image">Image</option>
                <option value="document">Document</option>
                <option value="infographic">Infographic</option>
              </select>
              <input
                type="file"
                name="file"
                required
              />
              <label>
                <input
                  type="checkbox"
                  checked={newFormData.is_featured}
                  onChange={() => setNewFormData({ ...newFormData, is_featured: !newFormData.is_featured })}
                />
                Featured
              </label>
              <div className="form-buttons">
                <button type="submit" disabled={uploading}>
                  {uploading ? 'Uploading...' : 'Submit'}
                </button>
                <button type="button" onClick={() => setShowUploadForm(false)}>
                  Cancel
                </button>
              </div>
              {error && <p className="error-message">{error}</p>}
            </form>
          </div>
        )}

        <div className="controls">
          <div className="filters">
            {/* Add status filter */}
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="article">Articles</option>
              <option value="video">Videos</option>
              <option value="image">Images</option>
              <option value="document">Documents</option>
              <option value="infographic">Infographics</option>
            </select>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="created_at">Date Added</option>
              <option value="title">Title</option>
              <option value="content_type">Type</option>
            </select>
          </div>
        </div>

        <div className="resources-grid">
          {filteredResources.map(resource => (
            <div key={resource.id} className="resource-card">
              <div className="resource-header">
                <h3>{resource.title}</h3>
                <div className={getStatusBadgeClass(resource.status)}>
                  {resource.status?.toUpperCase()}
                </div>
              </div>
              
              <div className="resource-content">
                <div className="resource-info">
                  <p><strong>Type:</strong> {resource.content_type}</p>
                  <p><strong>Submitted:</strong> {new Date(resource.created_at).toLocaleDateString()}</p>
                  <p><strong>Status:</strong> {resource.status}</p>
                  <p className="description"><strong>Description:</strong> {resource.description}</p>
                </div>
                
                {resource.status === 'rejected' && (
                  <p className="rejection-reason">
                    <strong>Rejection reason:</strong> {resource.rejection_reason}
                  </p>
                )}
              </div>

              <div className="resource-actions">
                <button 
                  className="view-btn"
                  onClick={() => handleView(resource)}
                >
                  View Details
                </button>

                {/* Only show delete button if user is the creator */}
                {isContentCreator(resource) && (
                  <button 
                    className="delete-btn"
                    onClick={() => handleDelete(resource.id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Update the detail view modal content section */}
        {showDetailView && selectedContent && (
          <div className="modal">
            <div className="modal-content">
              <div className="modal-header">
                <h2>{selectedContent.title}</h2>
                <div className="modal-actions">
                  <button 
                    className="share-btn"
                    onClick={() => handleShare(selectedContent)}
                  >
                    Share
                  </button>
                  {/* Show edit and delete buttons for all providers */}
                  <button 
                    className="edit-btn"
                    onClick={() => handleEdit(selectedContent)}
                  >
                    Edit
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDelete(selectedContent.id)}
                  >
                    Delete
                  </button>
                  <button 
                    className="close-btn"
                    onClick={() => setShowDetailView(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
              
              <div className="content-details">
                <p><strong>Type:</strong> {selectedContent.content_type}</p>
                <p><strong>Status:</strong> {selectedContent.status}</p>
                <p><strong>Description:</strong> {selectedContent.description}</p>
                {selectedContent.file && (
                  <div className="content-preview">
                    {selectedContent.content_type === 'image' ? (
                      <img src={selectedContent.file} alt={selectedContent.title} />
                    ) : (
                      <a href={selectedContent.file} target="_blank" rel="noopener noreferrer">
                        View Resource
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderHealthCorner;
