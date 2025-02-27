import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getForumPosts, createPost } from "../services/forumService";
import "./ForumDetails.css";

const ForumDetails = () => {
  const { forumId } = useParams();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [error, setError] = useState(null);

  useEffect(() => {
    getForumPosts(forumId)
      .then((response) => setPosts(response.data))
      .catch((error) => console.error("Error fetching posts:", error));
  }, [forumId]);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content) {
      setError("Title and content are required");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await createPost(forumId, newPost, token);
      setPosts([...posts, response.data]);
      setNewPost({ title: "", content: "" });
      setError(null);
    } catch (error) {
      console.error("Error creating post:", error);
      setError("Failed to create post.");
    }
  };

  return (
    <div className="forum-details-container">
      <h2>Forum Posts</h2>

      {/* ✅ Post Creation Form */}
      <form onSubmit={handleCreatePost}>
        <input
          type="text"
          placeholder="Enter post title"
          value={newPost.title}
          onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
        />
        <textarea
          placeholder="Enter post content"
          value={newPost.content}
          onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
        />
        <button type="submit">Create Post</button>
      </form>

      {error && <p className="error">{error}</p>}

      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <a href={`/dashboard/forum/${forumId}/posts/${post.id}`}>{post.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ForumDetails;
