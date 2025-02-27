import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPostComments, createComment } from "../services/forumService";
import "./PostDetail.css";

const PostDetail = () => {
  const { postId } = useParams();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    getPostComments(postId)
      .then((response) => setComments(response.data))
      .catch((error) => console.error("Error fetching comments:", error));
  }, [postId]);

  const handleCreateComment = async (e) => {
    e.preventDefault();
    if (!newComment) {
      setError("Comment cannot be empty");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await createComment(postId, { content: newComment }, token);
      setComments([...comments, response.data]);
      setNewComment("");
      setError(null);
    } catch (error) {
      console.error("Error creating comment:", error);
      setError("Failed to create comment.");
    }
  };

  return (
    <div className="post-detail-container">
      <h2>Post Comments</h2>

      {/* ✅ Comment Creation Form */}
      <form onSubmit={handleCreateComment}>
        <textarea
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button type="submit">Post Comment</button>
      </form>

      {error && <p className="error">{error}</p>}

      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>{comment.content}</li>
        ))}
      </ul>
    </div>
  );
};

export default PostDetail;
