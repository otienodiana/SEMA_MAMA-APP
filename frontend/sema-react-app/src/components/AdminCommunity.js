import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminCommunity.css";
import { useAuth } from "./AuthContext"; // Add this import
import { useNavigate } from "react-router-dom";

const AdminCommunity = () => {
  const navigate = useNavigate();
  const [forums, setForums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingForum, setEditingForum] = useState(null);
  const { user } = useAuth();
  const FORUMS_PER_CATEGORY = 3; // Number of forums to show initially

  const categories = [
    'Pregnancy',
    'Postpartum',
    'Parenting',
    'Mental Health',
    'General'
  ];

  const [newForum, setNewForum] = useState({
    name: '',
    description: '',
    visibility: 'public',
    category: '',
    profile_picture: null
  });

  const normalizeCategory = (rawCategory) => {
    if (!rawCategory || typeof rawCategory !== 'string') {
      console.log('Empty or invalid category, defaulting to General');
      return 'General';
    }

    const normalized = rawCategory.trim().toLowerCase();
    
    // Try exact match first
    const exactMatch = categories.find(cat => cat.toLowerCase() === normalized);
    if (exactMatch) {
      console.log(`Found exact match: ${exactMatch} for ${rawCategory}`);
      return exactMatch;
    }

    // Try partial match
    const partialMatch = categories.find(cat => 
      normalized.includes(cat.toLowerCase()) || 
      cat.toLowerCase().includes(normalized)
    );
    
    if (partialMatch) {
      console.log(`Found partial match: ${partialMatch} for ${rawCategory}`);
      return partialMatch;
    }

    console.log(`No match found for "${rawCategory}", defaulting to General`);
    return 'General';
  };

  useEffect(() => {
    fetchForums();
  }, []);

  const fetchForums = async () => {
    try {
      const token = localStorage.getItem('access');
      const response = await axios.get('http://localhost:8000/api/community/forums/', {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Raw forums data:', response.data);

      const forumsWithCategories = response.data.map(forum => {
        const rawCategory = forum.category;
        console.log(`Processing forum "${forum.name}":`, { 
          rawCategory, 
          type: typeof rawCategory 
        });

        const normalizedCategory = normalizeCategory(rawCategory);
        console.log(`Forum "${forum.name}" - Raw: "${rawCategory}" → Normalized: "${normalizedCategory}"`);

        return {
          ...forum,
          category: normalizedCategory
        };
      });

      console.log('Final categorized forums:', forumsWithCategories);
      setForums(forumsWithCategories);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching forums:', err);
      setError('Failed to fetch forums');
      setLoading(false);
    }
  };

  const handleCreateForum = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access');
      const formData = new FormData();
      
      // Ensure category is explicitly set
      const forumData = {
        name: newForum.name,
        description: newForum.description,
        visibility: newForum.visibility,
        category: selectedCategory || 'General' // Ensure category is always set
      };

      console.log('Creating forum with data:', forumData);

      Object.entries(forumData).forEach(([key, value]) => {
        formData.append(key, value);
      });

      if (newForum.profile_picture) {
        formData.append('profile_picture', newForum.profile_picture);
      }

      const response = await axios.post(
        'http://localhost:8000/api/community/forums/',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      // Refresh forums to get updated categories
      await fetchForums();
      setShowCreateModal(false);
      setNewForum({
        name: '',
        description: '',
        visibility: 'public',
        category: '',
        profile_picture: null
      });
    } catch (err) {
      console.error('Create forum error:', err.response?.data);
      setError(err.response?.data?.message || 'Failed to create forum');
    }
  };

  const handleJoinForum = async (forumId) => {
    try {
      const token = localStorage.getItem('access');
      await axios.post(`http://localhost:8000/api/community/forums/${forumId}/join/`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchForums();
      // Navigate to forum detail page after joining
      navigate(`/dashboard/admin/community/forums/${forumId}`);
    } catch (err) {
      setError('Failed to join forum');
    }
  };

  const handleExitForum = async (forumId) => {
    try {
      const token = localStorage.getItem('access');
      await axios.post(`http://localhost:8000/api/community/forums/${forumId}/exit/`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchForums();
    } catch (err) {
      setError('Failed to exit forum');
    }
  };

  const handleDeleteForum = async (forumId) => {
    if (window.confirm('Are you sure you want to delete this forum?')) {
      try {
        const token = localStorage.getItem('access');
        await axios.delete(`http://localhost:8000/api/community/forums/${forumId}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setForums(forums.filter(forum => forum.id !== forumId));
      } catch (err) {
        setError('Failed to delete forum');
      }
    }
  };

  const handleUpdateForum = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access');
      const formData = new FormData();
      
      // Ensure category is included in update
      const updatedData = {
        ...editingForum,
        category: editingForum.category || 'General' // Preserve or default category
      };

      Object.entries(updatedData).forEach(([key, value]) => {
        if (key === 'profile_picture' && value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, value);
        }
      });

      await axios.put(
        `http://localhost:8000/api/community/forums/${editingForum.id}/`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setShowEditModal(false);
      setEditingForum(null);
      fetchForums();
    } catch (err) {
      setError('Failed to update forum');
    }
  };

  const handleCategoryClick = (category) => {
    if (expandedCategory === category) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(category);
    }
  };

  const renderForumCard = (forum) => (
    <div key={forum.id} className="forum-card">
      {forum.profile_picture && (
        <img 
          src={forum.profile_picture} 
          alt={forum.name} 
          className="forum-image"
        />
      )}
      <h3>{forum.name}</h3>
      <p>{forum.description}</p>
      <p>Visibility: {forum.visibility}</p>
      <p>Members: {forum.members?.length || 0}</p>
      
      <div className="forum-actions">
        {forum.members?.includes(user?.id) ? (
          <button 
            className="view-posts-btn"
            onClick={() => navigate(`/dashboard/admin/community/forums/${forum.id}`)}
          >
            View Posts
          </button>
        ) : (
          <button 
            className="join-btn"
            onClick={() => handleJoinForum(forum.id)}
          >
            Join Forum
          </button>
        )}
        
        {user?.role === 'admin' && (
          <>
            <button 
              className="edit-btn"
              onClick={() => {
                setEditingForum(forum);
                setShowEditModal(true);
              }}
            >
              Edit
            </button>
            <button 
              className="delete-btn"
              onClick={() => handleDeleteForum(forum.id)}
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="admin-community-container">
      <h1>Community Forums Management</h1>

      {categories.map(category => {
        const categoryForums = forums.filter(forum => forum.category === category);
        console.log(`${category} has ${categoryForums.length} forums:`, 
          categoryForums.map(f => f.name));

        const displayForums = expandedCategory === category 
          ? categoryForums 
          : categoryForums.slice(0, FORUMS_PER_CATEGORY);

        return (
          <div key={category} className="category-section">
            <div className="category-header">
              <h2 
                className="category-title"
                onClick={() => handleCategoryClick(category)}
              >
                {category} ({categoryForums.length})
              </h2>
              <button 
                className="create-forum-btn"
                onClick={() => {
                  setSelectedCategory(category);
                  setNewForum(prev => ({...prev, category: category.toLowerCase()}));
                  setShowCreateModal(true);
                }}
              >
                + Create Forum
              </button>
            </div>

            <div className="forums-grid">
              {displayForums.map(forum => renderForumCard(forum))}
            </div>

            {categoryForums.length > FORUMS_PER_CATEGORY && (
              <button 
                className="view-more-btn"
                onClick={() => handleCategoryClick(category)}
              >
                {expandedCategory === category ? 'Show Less' : 'View More'}
              </button>
            )}
          </div>
        );
      })}

      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Create New Forum in {selectedCategory}</h2>
            <form onSubmit={handleCreateForum}>
              <input
                type="text"
                placeholder="Forum Name"
                value={newForum.name}
                onChange={(e) => setNewForum({...newForum, name: e.target.value})}
                required
              />
              <textarea
                placeholder="Forum Description"
                value={newForum.description}
                onChange={(e) => setNewForum({...newForum, description: e.target.value})}
                required
              />
              <select
                value={newForum.visibility}
                onChange={(e) => setNewForum({...newForum, visibility: e.target.value})}
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
              <input
                type="file"
                onChange={(e) => setNewForum({...newForum, profile_picture: e.target.files[0]})}
                accept="image/*"
              />
              <div className="modal-buttons">
                <button type="submit">Create Forum</button>
                <button type="button" onClick={() => setShowCreateModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && editingForum && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Edit Forum</h2>
            <form onSubmit={handleUpdateForum}>
              <input
                type="text"
                placeholder="Forum Name"
                value={editingForum.name}
                onChange={(e) => setEditingForum({...editingForum, name: e.target.value})}
                required
              />
              <textarea
                placeholder="Forum Description"
                value={editingForum.description}
                onChange={(e) => setEditingForum({...editingForum, description: e.target.value})}
                required
              />
              <select
                value={editingForum.visibility}
                onChange={(e) => setEditingForum({...editingForum, visibility: e.target.value})}
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
              <select
                value={editingForum.category || 'General'}
                onChange={(e) => setEditingForum({...editingForum, category: e.target.value})}
                required
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <input
                type="file"
                onChange={(e) => setEditingForum({...editingForum, profile_picture: e.target.files[0]})}
                accept="image/*"
              />
              <div className="modal-buttons">
                <button type="submit">Update Forum</button>
                <button type="button" onClick={() => {
                  setShowEditModal(false);
                  setEditingForum(null);
                }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCommunity;
