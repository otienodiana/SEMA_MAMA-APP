import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './AuthContext';
import './ForumDetail.css';

const ForumDetail = () => {
  const { forumId } = useParams();
  const { user } = useAuth();
  const [forum, setForum] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPostForm, setShowPostForm] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState({});  // Track comment form visibility for each post
  const [members, setMembers] = useState([]);
  const [showMembers, setShowMembers] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [showAddMemberForm, setShowAddMemberForm] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');

  useEffect(() => {
    checkMembershipStatus();
  }, [forumId]);

  const fetchForumDetails = async () => {
    try {
      const token = localStorage.getItem('access');
      const [forumRes, postsRes] = await Promise.all([
        axios.get(`http://localhost:8000/api/community/forums/${forumId}/`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`http://localhost:8000/api/community/forums/${forumId}/posts/`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      // Simplified post handling with author info from serializer
      const postsData = postsRes.data.map(post => ({
        ...post,
        authorName: post.author.name || post.author.username,
        comments: post.comments || []
      }));

      setForum(forumRes.data);
      setPosts(postsData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching forum details:', err);
      setError('Failed to fetch forum details');
      setLoading(false);
    }
  };

  const checkMembershipStatus = async () => {
    try {
      const token = localStorage.getItem('access');
      const response = await axios.get(`http://localhost:8000/api/community/forums/${forumId}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data) {
        const forumData = response.data;
        setForum(forumData);
        const memberIds = forumData.members?.map(member => member.id) || [];
        setIsMember(memberIds.includes(user?.id));
        setMembers(forumData.members || []);
        
        if (memberIds.includes(user?.id)) {
          await fetchForumDetails();
        }
      }
    } catch (err) {
      console.error('Error checking membership:', err.response?.data);
      setError('Failed to check membership status');
    }
  };

  const handleJoinForum = async () => {
    try {
      const token = localStorage.getItem('access');
      await axios.post(
        `http://localhost:8000/api/community/forums/${forumId}/join_forum/`, 
        { user_id: user.id }, // Send user_id in request body
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Fetch updated forum details after joining
      await checkMembershipStatus();
    } catch (err) {
      console.error('Join forum error:', err.response?.data);
      setError('Failed to join forum: ' + (err.response?.data?.detail || err.message));
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access');
      const response = await axios.post(
        `http://localhost:8000/api/community/forums/${forumId}/posts/`,
        newPost,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts([response.data, ...posts]);
      setNewPost({ title: '', content: '' });
      setShowPostForm(false); // Collapse the form after successful creation
    } catch (err) {
      setError('Failed to create post');
    }
  };

  const handleCreateComment = async (postId) => {
    try {
      const token = localStorage.getItem('access');
      const commentData = {
        content: newComment,
        post: postId,  // Add post ID to request
        created_by: user.id  // Add user ID to request
      };

      console.log('Sending comment data:', commentData); // Debug log

      const response = await axios.post(
        `http://localhost:8000/api/community/posts/${postId}/comments/`,
        commentData,
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      
      // Update posts to include new comment
      const updatedPosts = posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...(post.comments || []), {
              ...response.data,
              authorName: user.username || user.name || user.id
            }]
          };
        }
        return post;
      });

      setPosts(updatedPosts);
      setNewComment('');
      setShowCommentForm({ ...showCommentForm, [postId]: false }); // Close comment form
    } catch (err) {
      console.error('Comment error:', err.response?.data); // Debug error
      setError('Failed to add comment');
    }
  };

  const handleLikePost = async (postId) => {
    try {
      const token = localStorage.getItem('access');
      await axios.post(
        `http://localhost:8000/api/community/posts/${postId}/like/`, 
        {},
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Update the posts state locally
      setPosts(posts.map(post => {
        if (post.id === postId) {
          const userLiked = post.likes.includes(user.id);
          return {
            ...post,
            likes: userLiked 
              ? post.likes.filter(id => id !== user.id)  // Remove user's like
              : [...post.likes, user.id]  // Add user's like
          };
        }
        return post;
      }));
    } catch (err) {
      console.error('Like error:', err.response?.data);
      setError('Failed to like post');
    }
  };

  const handleExitForum = async () => {
    if (window.confirm('Are you sure you want to exit this forum?')) {
      try {
        const token = localStorage.getItem('access');
        const response = await axios.post(
          `http://localhost:8000/api/community/forums/${forumId}/exit/`, // Changed from leave_forum to exit
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.status === 'success') {
          // Redirect to admin community page after successful exit
          window.location.href = '/dashboard/admin/community';
        }
      } catch (err) {
        console.error('Exit forum error:', err.response?.data);
        setError('Failed to exit forum');
      }
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access');
      await axios.post(`http://localhost:8000/api/community/forums/${forumId}/add_member/`, 
        { email: newMemberEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewMemberEmail('');
      setShowAddMemberForm(false);
      await checkMembershipStatus();
    } catch (err) {
      console.error('Add member error:', err.response?.data);
      setError(err.response?.data?.detail || 'Failed to add member');
    }
  };

  const renderPost = (post) => (
    <div key={post.id} className="post-card">
      <h3>{post.title}</h3>
      <p>{post.content}</p>
      <div className="post-actions">
        <p className="post-meta">
          Posted by {post.authorName} on {new Date(post.created_at).toLocaleDateString()}
        </p>
        <div className="like-buttons">
          <button 
            className={`like-btn ${post.likes?.includes(user?.id) ? 'liked' : ''}`}
            onClick={() => handleLikePost(post.id)}
          >
            {post.likes?.includes(user?.id) ? 'Unlike' : 'Like'}
            <span className="like-count">({post.likes?.length || 0})</span>
          </button>
        </div>
      </div>
      
      <div className="comments-section">
        {post.comments?.map(comment => (
          <div key={comment.id} className="comment">
            <p>{comment.content}</p>
            <p className="comment-meta">
              By {comment.authorName} on {new Date(comment.created_at).toLocaleDateString()}
            </p>
          </div>
        ))}
        
        <button 
          className="reply-btn"
          onClick={() => setShowCommentForm({
            ...showCommentForm,
            [post.id]: !showCommentForm[post.id]
          })}
        >
          {showCommentForm[post.id] ? 'Cancel Reply' : 'Reply'}
        </button>

        {showCommentForm[post.id] && (
          <div className="add-comment">
            <textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button onClick={() => {
              handleCreateComment(post.id);
              setShowCommentForm({ ...showCommentForm, [post.id]: false });
            }}>
              Add Comment
            </button>
          </div>
        )}
      </div>
    </div>
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!forum) return <div>Forum not found</div>;

  return (
    <div className="forum-detail">
      <div className="forum-header">
        <div className="header-content">
          <h1>{forum.name}</h1>
          <p>{forum.description}</p>
        </div>
        <div className="forum-management">
          {isMember ? (
            <div className="forum-actions">
              <button 
                className="members-btn"
                onClick={() => setShowMembers(!showMembers)}
              >
                Members ({members.length})
              </button>
              <button 
                className="add-member-btn"
                onClick={() => setShowAddMemberForm(!showAddMemberForm)}
              >
                Add Member
              </button>
              <button 
                className="exit-forum-btn"
                onClick={handleExitForum}
              >
                Exit Forum
              </button>
            </div>
          ) : (
            <button 
              className="join-forum-btn"
              onClick={handleJoinForum}
            >
              Join Forum
            </button>
          )}

          {showMembers && (
            <div className="members-list">
              <div className="members-header">
                <h3>Forum Members</h3>
                {isMember && (
                  <button 
                    className="add-member-btn-small"
                    onClick={() => setShowAddMemberForm(!showAddMemberForm)}
                  >
                    + Add
                  </button>
                )}
              </div>
              <div className="members-grid">
                {members.map(member => (
                  <div key={member.id} className="member-card">
                    {member.profile_picture && (
                      <img 
                        src={member.profile_picture} 
                        alt={member.username} 
                        className="member-avatar"
                      />
                    )}
                    <p>{member.username || member.name}</p>
                    {member.role && <span className="member-role">{member.role}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {showAddMemberForm && (
            <div className="add-member-form">
              <h3>Add New Member</h3>
              <form onSubmit={handleAddMember}>
                <input
                  type="email"
                  placeholder="Enter member's email"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  required
                />
                <div className="form-buttons">
                  <button type="submit">Add Member</button>
                  <button 
                    type="button" 
                    onClick={() => setShowAddMemberForm(false)}
                    className="cancel-btn"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Show posts section only if user is a member */}
      {isMember ? (
        <>
          <button 
            className="create-post-btn"
            onClick={() => setShowPostForm(!showPostForm)}
          >
            {showPostForm ? 'Cancel Post' : 'Create New Post'}
          </button>

          {showPostForm && (
            <div className="create-post">
              <h2>Create New Post</h2>
              <form onSubmit={handleCreatePost}>
                <input
                  type="text"
                  placeholder="Post Title"
                  value={newPost.title}
                  onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                  required
                />
                <textarea
                  placeholder="Post Content"
                  value={newPost.content}
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                  required
                />
                <button type="submit">Create Post</button>
              </form>
            </div>
          )}

          <div className="posts-list">
            {posts.map(post => renderPost(post))}
          </div>
        </>
      ) : (
        <div className="join-message">
          <p>Join this forum to view and create posts</p>
        </div>
      )}
    </div>
  );
};

export default ForumDetail;
