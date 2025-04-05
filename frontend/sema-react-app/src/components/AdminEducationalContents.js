import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminEducationalContents.css';
import { useNavigate } from 'react-router-dom';
import { FaEllipsisV } from 'react-icons/fa';

const AdminEducationalContents = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('created_at');
  const [filterType, setFilterType] = useState('all');
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const navigate = useNavigate();
  const [editingResource, setEditingResource] = useState(null);
  const userRole = JSON.parse(localStorage.getItem('user'))?.role;
  const [statusFilter, setStatusFilter] = useState('all');
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedContent, setSelectedContent] = useState(null);
  const [showDetailView, setShowDetailView] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    const token = localStorage.getItem("access");
    try {
      const [allContent, pendingContent] = await Promise.all([
        axios.get("http://localhost:8000/api/content/contents/", {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get("http://localhost:8000/api/educational/content/pending/", {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const combinedResources = [
        ...allContent.data,
        ...pendingContent.data
      ];

      console.log("Resources:", combinedResources);
      setResources(combinedResources);
      setLoading(false);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch resources");
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) return;

    const token = localStorage.getItem("access");
    try {
      await axios.delete(
        `http://localhost:8000/api/content/contents/${id}/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setResources(resources.filter(resource => resource.id !== id));
      alert("Resource deleted successfully!");
    } catch (err) {
      console.error("Delete error:", err.response?.data);
      setError(err.response?.data?.detail || "Failed to delete resource");
    }
  };

  const toggleFeatured = async (id, currentStatus) => {
    const token = localStorage.getItem("access");
    try {
      await axios.patch(
        `http://localhost:8000/api/content/contents/${id}/`,
        { is_featured: !currentStatus },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );
      fetchResources();
    } catch (err) {
      setError("Failed to update resource status");
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access");
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token || !user) return;

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
          }
        }
      );

      console.log("Upload response:", response.data);

      const newResource = {
        ...response.data,
        created_by: {
          username: user.username,
          id: user.id
        }
      };

      setResources(prevResources => [...prevResources, newResource]);
      alert("File uploaded successfully!");
      e.target.reset();
      setIsFeatured(false);
      setShowUploadForm(false);
    } catch (err) {
      console.error("Upload error:", err.response?.data);
      setError(
        err.response?.data?.error || 
        err.response?.data?.detail || 
        "Error uploading file"
      );
    } finally {
      setUploading(false);
    }
  };

  const handleView = async (id) => {
    const token = localStorage.getItem("access");
    try {
      const response = await axios.get(
        `http://localhost:8000/api/content/contents/${id}/`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setSelectedContent({
        ...response.data,
        status: response.data.status || 'pending'
      });
      setShowDetailView(true);
    } catch (err) {
      setError("Failed to fetch resource details");
    }
  };

  const handleEdit = (resource) => {
    setEditingResource(resource);
    setShowUploadForm(true);
  };

  const handleApprove = async (id) => {
    const token = localStorage.getItem("access");
    try {
      const response = await axios.patch(
        `http://localhost:8000/api/educational/content/approve/${id}/`,
        {},
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );

      if (response.data.status === 'success') {
        setResources(prev => 
          prev.map(resource => 
            resource.id === id 
              ? { ...resource, status: 'approved' } 
              : resource
          )
        );
        alert("Resource approved successfully!");
        fetchResources();
      }
    } catch (err) {
      console.error("Approval error:", err.response?.data);
      setError("Failed to approve resource");
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt("Please provide a reason for rejection:");
    if (!reason) {
      alert("Rejection reason is required");
      return;
    }

    const token = localStorage.getItem("access");
    try {
      const response = await axios.patch(
        `http://localhost:8000/api/content/contents/${id}/reject/`,
        { rejection_reason: reason },
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        }
      );

      if (response.data) {
        fetchResources();
        alert("Resource rejected successfully!");
        if (showDetailView) {
          setShowDetailView(false);
          setSelectedContent(null);
        }
      }
    } catch (err) {
      console.error("Reject error:", err.response?.data);
      setError(
        err.response?.data?.error || 
        err.response?.data?.detail || 
        "Failed to reject resource"
      );
      alert(err.response?.data?.error || "Failed to reject resource");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingResource) return;

    const token = localStorage.getItem("access");
    const formData = new FormData();

    const fileInput = e.target.querySelector('input[type="file"]');
    if (fileInput.files.length) {
      formData.append("file", fileInput.files[0]);
    }

    formData.append("title", e.target.title.value.trim());
    formData.append("description", e.target.description.value.trim());
    formData.append("content_type", e.target.content_type.value);
    formData.append("is_featured", isFeatured);

    try {
      await axios.patch(
        `http://localhost:8000/api/content/contents/${editingResource.id}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          }
        }
      );

      fetchResources();
      setEditingResource(null);
      setShowUploadForm(false);
      alert("Resource updated successfully!");
    } catch (err) {
      setError("Failed to update resource");
    }
  };

  const filteredResources = resources
    .filter(resource => {
      if (statusFilter !== 'all') return resource.status === statusFilter;
      if (userRole === 'mom') return resource.status === 'approved';
      return true;
    })
    .filter(resource => {
      if (filterType === 'all') return true;
      return resource.content_type === filterType;
    })
    .sort((a, b) => {
      if (sortBy === 'created_at') {
        return new Date(b.created_at) - new Date(a.created_at);
      }
      return a[sortBy].localeCompare(b[sortBy]);
    });

  const StatusBadge = ({ status }) => {
    const getStatusColor = () => {
      switch (status?.toLowerCase()) {
        case 'pending': return '#ffc107';
        case 'approved': return '#28a745';
        case 'rejected': return '#dc3545';
        default: return '#6c757d';
      }
    };

    return (
      <span style={{
        backgroundColor: getStatusColor(),
        color: status?.toLowerCase() === 'pending' ? 'black' : 'white',
        padding: '4px 8px',
        borderRadius: '12px',
        fontSize: '0.85rem',
      }}>
        {status ? status.toUpperCase() : 'N/A'}
      </span>
    );
  };

  if (loading) return <div>Loading resources...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="admin-resources-container">
      {!showDetailView ? (
        <>
          <div className="header-section">
            <h2>{userRole === 'mom' ? 'Educational Resources' : 'Manage Educational Resources'}</h2>
            {(userRole === 'admin' || userRole === 'healthcare_provider') && (
              <button 
                className="new-upload-btn"
                onClick={() => setShowUploadForm(!showUploadForm)}
              >
                {showUploadForm ? 'Cancel Upload' : 'New Upload'}
              </button>
            )}
          </div>

          {(userRole === 'admin' || userRole === 'healthcare_provider') && showUploadForm && (
            <div className="upload-form-section">
              <form onSubmit={editingResource ? handleUpdate : handleUpload}>
                <div className="form-group">
                  <label>File*</label>
                  <input type="file" />
                </div>
                <div className="form-group">
                  <label>Title*</label>
                  <input type="text" name="title" defaultValue={editingResource?.title || ''} required />
                </div>
                <div className="form-group">
                  <label>Description*</label>
                  <textarea name="description" defaultValue={editingResource?.description || ''} required />
                </div>
                <div className="form-group">
                  <label>Content Type*</label>
                  <select name="content_type" defaultValue={editingResource?.content_type || ''} required>
                    <option value="">Select type</option>
                    <option value="article">Article</option>
                    <option value="video">Video</option>
                    <option value="image">Image</option>
                    <option value="document">Document</option>
                    <option value="infographic">Infographic</option>
                  </select>
                </div>
                <div className="form-group checkbox">
                  <label>
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                    />
                    Feature on Homepage
                  </label>
                </div>
                <button type="submit" disabled={uploading}>
                  {uploading ? "Uploading..." : editingResource ? "Update" : "Upload"}
                </button>
              </form>
            </div>
          )}

          {(userRole === 'admin' || userRole === 'healthcare_provider') && (
            <div className="controls">
              <div className="filters">
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
          )}

          <div className="resources-table">
            {filteredResources.map((resource) => (
              <div key={resource.id} className="resource-card">
                <div className="card-header">
                  <h3>{resource.title}</h3>
                  <button 
                    className="menu-dots"
                    onClick={() => setActiveMenu(activeMenu === resource.id ? null : resource.id)}
                  >
                    <FaEllipsisV />
                  </button>
                </div>
                
                <div className="resource-content">
                  <p>{resource.description}</p>
                  <span>Type: {resource.content_type}</span>
                </div>

                {activeMenu === resource.id && (
                  <div className="action-menu">
                    <button onClick={() => handleView(resource.id)}>
                      View
                    </button>
                    {userRole === 'admin' && resource.status === 'pending' && (
                      <>
                        <button onClick={() => handleApprove(resource.id)}>
                          Approve
                        </button>
                        <button onClick={() => {
                          const reason = prompt("Please enter rejection reason:");
                          if (reason) handleReject(resource.id, reason);
                        }}>
                          Reject
                        </button>
                      </>
                    )}
                    {(userRole === 'admin' || resource.created_by?.id === JSON.parse(localStorage.getItem('user')).id) && (
                      <>
                        <button onClick={() => handleEdit(resource)}>
                          Edit
                        </button>
                        <button onClick={() => handleDelete(resource.id)}>
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="content-detail-view">
          <div className="detail-header">
            <button 
              className="back-btn"
              onClick={() => {
                setShowDetailView(false);
                setSelectedContent(null);
                fetchResources();
              }}
            >
              Back to List
            </button>
            <h2>{selectedContent.title}</h2>
            <StatusBadge status={selectedContent.status || 'pending'} />
          </div>

          <div className="detail-content">
            <div className="content-meta">
              <p><strong>Type:</strong> {selectedContent.content_type}</p>
              <p><strong>Created by:</strong> {selectedContent.created_by?.username}</p>
              <p><strong>Date:</strong> {new Date(selectedContent.created_at).toLocaleDateString()}</p>
              <p><strong>Status:</strong> {selectedContent.status?.toUpperCase() || 'PENDING'}</p>
            </div>

            <div className="content-description">
              <h3>Description</h3>
              <p>{selectedContent.description}</p>
            </div>

            <div className="content-preview">
              {selectedContent.uploaded_file && (
                <>
                  {selectedContent.content_type === 'image' && (
                    <img src={selectedContent.uploaded_file} alt={selectedContent.title} />
                  )}
                  {selectedContent.content_type === 'video' && (
                    <video src={selectedContent.uploaded_file} controls />
                  )}
                  {['document', 'article', 'infographic'].includes(selectedContent.content_type) && (
                    <a 
                      href={selectedContent.uploaded_file} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="download-link"
                    >
                      Download {selectedContent.content_type}
                    </a>
                  )}
                </>
              )}
            </div>

            {userRole === 'admin' && selectedContent.status === 'pending' && (
              <div className="admin-actions">
                <button 
                  className="approve-btn"
                  onClick={() => {
                    handleApprove(selectedContent.id);
                    setShowDetailView(false);
                  }}
                >
                  Approve Resource
                </button>
                <button 
                  className="reject-btn"
                  onClick={() => {
                    handleReject(selectedContent.id);
                    setShowDetailView(false);
                  }}
                >
                  Reject Resource
                </button>
              </div>
            )}

            {selectedContent.status === 'rejected' && (
              <div className="rejection-details">
                <h3>Rejection Reason:</h3>
                <p>{selectedContent.rejection_reason}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEducationalContents;
