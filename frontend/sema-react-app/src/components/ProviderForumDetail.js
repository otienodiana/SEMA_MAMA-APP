import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ForumDetail.css';

const ProviderForumDetail = () => {
  const { forumId } = useParams();
  const [forum, setForum] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [showCommentForm, setShowCommentForm] = useState({});

  // Fetch forum details and posts
  useEffect(() => {
    fetchForumDetails();
    fetchPosts();
  }, [forumId]);

  const fetchForumDetails = async () => {
    try {
      const token = localStorage.getItem('access');
      const response = await axios.get(
        `http://localhost:8000/api/community/forums/${forumId}/`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setForum(response.data);
    } catch (err) {
      setError('Failed to fetch forum details');
    }
  };

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('access');
      const response = await axios.get(
        `http://localhost:8000/api/community/forums/${forumId}/posts/`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setPosts(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch posts');
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access');
      await axios.post(
        `http://localhost:8000/api/community/forums/${forumId}/posts/`,
        newPost,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setNewPost({ title: '', content: '' });
      setShowNewPostForm(false);
      fetchPosts(); // Refresh posts list
    } catch (err) {
      setError('Failed to create post');
    }
  };

  const handleAddComment = async (postId, comment) => {
    try {
      const token = localStorage.getItem('access');
      await axios.post(
        `http://localhost:8000/api/community/posts/${postId}/comments/`,
        { content: comment },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setShowCommentForm({ ...showCommentForm, [postId]: false });
      fetchPosts(); // Refresh to show new comment
    } catch (err) {
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
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      fetchPosts(); // Refresh to update likes
    } catch (err) {
      setError('Failed to like post');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!forum) return <div>Forum not found</div>;

  return (
    <div className="forum-detail-container">
      <div className="forum-header">
        <h1>{forum.name}</h1>
        <p>{forum.description}</p>
      </div>

      <button 
        className="new-post-btn"
        onClick={() => setShowNewPostForm(true)}
      >
        Create New Post
      </button>

      {showNewPostForm && (
        <div className="new-post-form">
          <h3>Create New Post</h3>
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
            <div className="form-buttons">
              <button type="submit">Create Post</button>
              <button type="button" onClick={() => setShowNewPostForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="posts-list">
        {posts.map(post => (
          <div key={post.id} className="post-card">
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <div className="post-meta">
              <span>Posted by: {post.author}</span>
              <span>Likes: {post.likes?.length || 0}</span>
              <button onClick={() => handleLikePost(post.id)}>Like</button>
              <button onClick={() => setShowCommentForm({...showCommentForm, [post.id]: true})}>
                Comment
              </button>
            </div>

            {showCommentForm[post.id] && (
              <div className="comment-form">
                <textarea
                  placeholder="Write a comment..."
                  onChange={(e) => setShowCommentForm({
                    ...showCommentForm,
                    [post.id]: { ...showCommentForm[post.id], content: e.target.value }
                  })}
                />
                <div className="form-buttons">
                  <button onClick={() => handleAddComment(post.id, showCommentForm[post.id]?.content)}>
                    Add Comment
                  </button>
                  <button onClick={() => setShowCommentForm({...showCommentForm, [post.id]: false})}>
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="comments-section">
              {post.comments?.map(comment => (
                <div key={comment.id} className="comment">
                  <p>{comment.content}</p>
                  <span>By: {comment.user}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProviderForumDetail;
