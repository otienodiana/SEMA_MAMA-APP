import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ContentDetail.css';

const ContentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userRole = JSON.parse(localStorage.getItem('user'))?.role;

  useEffect(() => {
    fetchResourceDetails();
  }, [id]);

  const fetchResourceDetails = async () => {
    const token = localStorage.getItem("access");
    try {
      const response = await axios.get(
        `http://localhost:8000/api/content/contents/${id}/`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setResource(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch resource details");
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    const token = localStorage.getItem("access");
    try {
      await axios.patch(
        `http://localhost:8000/api/content/contents/${id}/approve/`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      fetchResourceDetails();
      alert("Resource approved successfully!");
    } catch (err) {
      setError("Failed to approve resource");
    }
  };

  const handleReject = async () => {
    const reason = window.prompt("Please provide a reason for rejection:");
    if (!reason) return;

    const token = localStorage.getItem("access");
    try {
      await axios.patch(
        `http://localhost:8000/api/content/contents/${id}/reject/`,
        { rejection_reason: reason },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      fetchResourceDetails();
      alert("Resource rejected successfully!");
    } catch (err) {
      setError("Failed to reject resource");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!resource) return <div>Resource not found</div>;

  return (
    <div className="content-detail">
      <div className="content-header">
        <h1>{resource.title}</h1>
        <div className="status-badge" data-status={resource.status}>
          {resource.status}
        </div>
      </div>

      <div className="content-meta">
        <p>Type: {resource.content_type}</p>
        <p>Created by: {resource.created_by?.username}</p>
        <p>Date: {new Date(resource.created_at).toLocaleDateString()}</p>
      </div>

      <div className="content-body">
        <h2>Description</h2>
        <p>{resource.description}</p>

        {resource.uploaded_file && (
          <div className="content-preview">
            {resource.content_type === 'image' && (
              <img src={resource.uploaded_file} alt={resource.title} />
            )}
            {resource.content_type === 'video' && (
              <video src={resource.uploaded_file} controls />
            )}
            {['document', 'article', 'infographic'].includes(resource.content_type) && (
              <a href={resource.uploaded_file} target="_blank" rel="noopener noreferrer" 
                 className="download-link">
                Download {resource.content_type}
              </a>
            )}
          </div>
        )}
      </div>

      {userRole === 'admin' && resource.status === 'pending' && (
        <div className="admin-actions">
          <button onClick={handleApprove} className="approve-btn">
            Approve
          </button>
          <button onClick={handleReject} className="reject-btn">
            Reject
          </button>
        </div>
      )}

      {resource.status === 'rejected' && (
        <div className="rejection-details">
          <h3>Rejection Reason:</h3>
          <p>{resource.rejection_reason}</p>
        </div>
      )}

      <button onClick={() => navigate(-1)} className="back-btn">
        Back to List
      </button>
    </div>
  );
};

export default ContentDetail;
