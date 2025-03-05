import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaEllipsisV } from "react-icons/fa";
import "./PostDetail.css";

const PostDetail = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [editingComment, setEditingComment] = useState(null); // Track the comment being edited
    const [editedCommentText, setEditedCommentText] = useState(""); // Store new text for editing
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    async function fetchUser() {
        let token = localStorage.getItem("access");
        if (!token) return;

        try {
            const response = await fetch("http://localhost:8000/api/users/me/", {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) throw new Error("Failed to fetch user");
            const userData = await response.json();
            setUser(userData);
        } catch (error) {
            console.error("❌ Error fetching user:", error);
        }
    }

    const fetchPostDetail = useCallback(async () => {
        let token = localStorage.getItem("access");
        if (!token) return;

        try {
            const response = await fetch(`http://localhost:8000/api/community/posts/${id}/`, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) throw new Error("Failed to fetch post details");
            setPost(await response.json());
        } catch (error) {
            console.error("❌ Error fetching post:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, [id]);

    const fetchComments = useCallback(async () => {
        let token = localStorage.getItem("access");
        if (!token) return;

        try {
            const response = await fetch(`http://localhost:8000/api/community/posts/${id}/comments/`, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) throw new Error("Failed to fetch comments");
            setComments(await response.json());
        } catch (error) {
            console.error("❌ Error fetching comments:", error);
        }
    }, [id]);

    useEffect(() => {
        fetchUser();
        fetchPostDetail();
        fetchComments();
    }, [fetchPostDetail, fetchComments]);

    async function handleDeleteComment(commentId) {
        let token = localStorage.getItem("access");
        if (!token) return;

        if (!window.confirm("Are you sure you want to delete this comment?")) return;

        try {
            const response = await fetch(`http://localhost:8000/api/community/comments/${commentId}/`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) throw new Error("Failed to delete comment");

            setComments(comments.filter((comment) => comment.id !== commentId)); // Update UI
        } catch (error) {
            console.error("❌ Error deleting comment:", error);
        }
    }

    async function handleEditComment(commentId) {
        let token = localStorage.getItem("access");
        if (!token) return;

        try {
            const response = await fetch(`http://localhost:8000/api/community/comments/${commentId}/`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ content: editedCommentText }),
            });

            if (!response.ok) throw new Error("Failed to edit comment");

            setComments(
                comments.map((comment) =>
                    comment.id === commentId ? { ...comment, content: editedCommentText } : comment
                )
            );

            setEditingComment(null); // Close edit mode
        } catch (error) {
            console.error("❌ Error editing comment:", error);
        }
    }

    const handleCommentSubmit = async (e) => {
        e.preventDefault();

        if (!newComment.trim()) {
            alert("Comment cannot be empty!");
            return;
        }

        let token = localStorage.getItem("access");
        if (!token || !user) {
            alert("You must be logged in to comment!");
            return;
        }

        try {
            const response = await fetch(`http://localhost:8000/api/community/posts/${id}/comments/`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ post: id, user: user.id, content: newComment }),
            });

            const responseData = await response.json();

            if (!response.ok) {
                console.error("❌ Server Error:", responseData);
                throw new Error("Failed to post comment");
            }

            responseData.user = { username: user.username };

            setComments([...comments, responseData]);
            setNewComment("");
        } catch (error) {
            console.error("❌ Error posting comment:", error);
        }
    };

    return (
        <div className="post-detail-container">
            <button className="back-button" onClick={() => navigate(-1)}>
                ← Back
            </button>

            {loading && <p>Loading...</p>}
            {error && <p style={{ color: "red" }}>Error: {error}</p>}

            {post && (
                <>
                    <h2 className="post-title">{post.title}</h2>
                    <p className="post-content">{post.content}</p>

                    <div className="comments-section">
                        <h3>Comments</h3>
                        {comments.length === 0 ? (
                            <p>No comments yet. Be the first!</p>
                        ) : (
                            comments.map((comment) => (
                                <div key={comment.id} className="comment">
                                    {editingComment === comment.id ? (
                                        <>
                                            <textarea
                                                value={editedCommentText}
                                                onChange={(e) => setEditedCommentText(e.target.value)}
                                            />
                                            <button onClick={() => handleEditComment(comment.id)}>💾 Save</button>
                                            <button onClick={() => setEditingComment(null)}>❌ Cancel</button>
                                        </>
                                    ) : (
                                        <>
                                            <p>{comment.content}</p>
                                            <p>
                                                <strong>By:</strong> {comment.user ? comment.user.username : "Unknown"}
                                            </p>

                                            {user && comment.user.username === user.username && (
                                                <div className="comment-actions">
                                                    <button onClick={() => setEditingComment(comment.id) || setEditedCommentText(comment.content)}>
                                                        ✏️ Edit
                                                    </button>
                                                    <button onClick={() => handleDeleteComment(comment.id)}>🗑️ Delete</button>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            ))
                        )}
                    </div>

                    <form className="comment-form" onSubmit={handleCommentSubmit}>
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a comment..."
                        ></textarea>
                        <button type="submit">Post Comment</button>
                    </form>
                </>
            )}
        </div>
    );
};

export default PostDetail;
