import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './AdminCommunity.css';

const ProviderForum = () => {
  const [forums, setForums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDetailView, setShowDetailView] = useState(false);
  const [selectedForum, setSelectedForum] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddMemberForm, setShowAddMemberForm] = useState(false); // Add this line
  const [editingForum, setEditingForum] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const FORUMS_PER_CATEGORY = 3;

  const categories = [
    { id: 'general', name: 'General', description: 'General maternal health discussions' },
    { id: 'pregnancy', name: 'Pregnancy', description: 'Discuss pregnancy-related topics' },
    { id: 'postpartum', name: 'Postpartum', description: 'Support for new mothers' },
    { id: 'parenting', name: 'Parenting', description: 'General parenting advice' },
    { id: 'mental_health', name: 'Mental Health', description: 'Mental health support' }
  ];

  const [newForum, setNewForum] = useState({
    name: '',
    description: '',
    visibility: 'public',
    category: categories[0].id,  // Set default category to first one
    profile_picture: null,
    members: []
  });

  useEffect(() => {
    fetchForums();
  }, []);

  const fetchForums = async () => {
    try {
      const token = localStorage.getItem('access');
      const response = await axios.get('http://localhost:8000/api/community/forums/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setForums(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching forums:', err);
      setError('Failed to fetch forums');
      setLoading(false);
    }
  };

  const handleJoinForum = async (forumId) => {
    try {
      const token = localStorage.getItem('access');
      const response = await axios.post(
        `http://localhost:8000/api/community/forums/${forumId}/join/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.status === 'joined' || response.data.status === 'already_member') {
        await fetchForums();
        navigate(`/dashboard/provider/community/forums/${forumId}`);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to join forum');
    }
  };

  const handleExitForum = async (forumId) => {
    try {
      const token = localStorage.getItem('access');
      await axios.post(
        `http://localhost:8000/api/community/forums/${forumId}/exit/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchForums();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to exit forum');
    }
  };

  const handleCreateForum = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access');
    const formData = new FormData();

    // Validate required fields
    if (!newForum.name || !newForum.description || !newForum.category) {
      setError('Please fill in all required fields');
      return;
    }

    // Build form data
    formData.append('name', newForum.name.trim());
    formData.append('description', newForum.description.trim());
    formData.append('category', newForum.category);
    formData.append('visibility', newForum.visibility);

    if (newForum.profile_picture) {
      formData.append('profile_picture', newForum.profile_picture);
    }

    // Debug log
    console.log('Submitting forum data:', {
      name: newForum.name,
      description: newForum.description,
      category: newForum.category,
      visibility: newForum.visibility,
      hasProfilePicture: !!newForum.profile_picture
    });

    try {
      const response = await axios.post(
        'http://localhost:8000/api/community/forums/',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          }
        }
      );

      console.log('Forum creation response:', response.data);
      
      if (response.data) {
        setShowCreateModal(false);
        setNewForum({
          name: '',
          description: '',
          visibility: 'public',
          category: categories[0].id,
          profile_picture: null
        });
        await fetchForums();
        alert('Forum created successfully!');
      }
    } catch (err) {
      console.error('Create forum error:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message
      });
      setError(err.response?.data?.detail || err.response?.data?.error || 'Failed to create forum');
    }
  };

  const handleDeleteForum = async (forumId) => {
    if (!window.confirm('Are you sure you want to delete this forum?')) return;
    
    const token = localStorage.getItem('access');
    try {
      await axios.delete(
        `http://localhost:8000/api/community/forums/${forumId}/`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      fetchForums();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete forum');
    }
  };

  const handleEditForum = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access');
    const formData = new FormData();

    for (const [key, value] of Object.entries(editingForum)) {
      if (value !== null) {
        formData.append(key, value);
      }
    }

    try {
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
      setError(err.response?.data?.error || 'Failed to update forum');
    }
  };

  const isForumCreator = (forum) => {
    return forum.created_by === user?.id;
  };

  const handleCategoryClick = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  const filteredForums = forums.filter(forum => {
    const matchesCategory = selectedCategory === 'all' || forum.category === selectedCategory;
    const matchesSearch = forum.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         forum.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const renderForumCard = (forum) => (
    <div key={forum.id} className="forum-card">
      {forum.profile_picture && (
        <img 
          src={forum.profile_picture} 
          alt={forum.name} 
          className="forum-image"
        />
      )}
      <div className="forum-header">
        <h3>{forum.name}</h3>
        <span className="visibility-badge">{forum.visibility}</span>
      </div>
      
      <div className="forum-content">
        <p className="description">{forum.description}</p>
        <div className="forum-meta">
          <p>Category: {forum.category}</p>
          <p>Members: {forum.members?.length || 0}</p>
          <p>Created: {new Date(forum.created_at).toLocaleDateString()}</p>
        </div>
      </div>
      
      <div className="forum-actions">
        {forum.members?.includes(user?.id) ? (
          <>
            <button 
              className="view-posts-btn"
              onClick={() => navigate(`/dashboard/provider/community/forums/${forum.id}`)}
            >
              View Posts
            </button>
            <button 
              className="add-member-btn"
              onClick={() => {
                setSelectedForum(forum);
                setShowAddMemberForm(true);
              }}
            >
              Add Member
            </button>
            <button 
              className="exit-btn"
              onClick={() => handleExitForum(forum.id)}
            >
              Exit Forum
            </button>
            {isForumCreator(forum) && (
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
          </>
        ) : (
          <button 
            className="join-btn"
            onClick={() => handleJoinForum(forum.id)}
          >
            Join Forum
          </button>
        )}
      </div>
    </div>
  );

  if (loading) return <div>Loading forums...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="admin-community-container">
      <h1>Healthcare Provider Forums</h1>
      
      <button 
        className="create-forum-btn"
        onClick={() => setShowCreateModal(true)}
      >
        Create New Forum
      </button>

      {/* Categories and Forums Display */}
      {categories.map(category => {
        const categoryForums = forums.filter(forum => forum.category === category.id);
        const displayForums = expandedCategory === category.id 
          ? categoryForums 
          : categoryForums.slice(0, FORUMS_PER_CATEGORY);

        return (
          <div key={category.id} className="category-section">
            <div className="category-header">
              <h2 
                className="category-title"
                onClick={() => handleCategoryClick(category.id)}
              >
                {category.name} ({categoryForums.length})
              </h2>
            </div>

            <div className="forums-grid">
              {displayForums.map(forum => renderForumCard(forum))}
            </div>

            {categoryForums.length > FORUMS_PER_CATEGORY && (
              <button 
                className="view-more-btn"
                onClick={() => handleCategoryClick(category.id)}
              >
                {expandedCategory === category.id ? 'Show Less' : 'View More'}
              </button>
            )}
          </div>
        );
      })}

      {/* Create Forum Modal */}
      {showCreateModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Create New Forum</h2>
            <form onSubmit={handleCreateForum}>
              <div className="form-group">
                <label>Category*</label>
                <select
                  value={newForum.category}
                  onChange={(e) => setNewForum({...newForum, category: e.target.value})}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {newForum.category && (
                  <small className="category-description">
                    {categories.find(c => c.id === newForum.category)?.description}
                  </small>
                )}
              </div>

              <div className="form-group">
                <label>Forum Name*</label>
                <input
                  type="text"
                  placeholder="Enter forum name"
                  value={newForum.name}
                  onChange={(e) => setNewForum({...newForum, name: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description*</label>
                <textarea
                  placeholder="Enter forum description"
                  value={newForum.description}
                  onChange={(e) => setNewForum({...newForum, description: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Visibility</label>
                <select
                  value={newForum.visibility}
                  onChange={(e) => setNewForum({...newForum, visibility: e.target.value})}
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
              </div>

              <div className="form-group">
                <label>Forum Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewForum({...newForum, profile_picture: e.target.files[0]})}
                />
              </div>

              <div className="form-buttons">
                <button type="submit">Create Forum</button>
                <button type="button" onClick={() => setShowCreateModal(false)}>Cancel</button>
              </div>

              {error && <div className="error-message">{error}</div>}
            </form>
          </div>
        </div>
      )}

      {/* Edit Forum Modal */}
      {showEditModal && editingForum && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Forum</h2>
            <form onSubmit={handleEditForum}>
              <input
                type="text"
                placeholder="Forum Name"
                value={editingForum.name}
                onChange={(e) => setEditingForum({...editingForum, name: e.target.value})}
                required
              />
              <textarea
                placeholder="Description"
                value={editingForum.description}
                onChange={(e) => setEditingForum({...editingForum, description: e.target.value})}
                required
              />
              <select
                value={editingForum.category}
                onChange={(e) => setEditingForum({...editingForum, category: e.target.value})}
                required
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <input
                type="file"
                onChange={(e) => setEditingForum({...editingForum, profile_picture: e.target.files[0]})}
              />
              <div className="form-buttons">
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

      {showDetailView && selectedForum && (
        <div className="modal">
          <div className="modal-content">
            {/* Forum detail view content */}
            <button onClick={() => setShowDetailView(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderForum;
