import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaEllipsisV } from "react-icons/fa";
import { useTranslation } from 'react-i18next';
import "./PostDetail.css";

const PostDetail = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [editingComment, setEditingComment] = useState(null); // Track the comment being edited
    const [editedCommentText, setEditedCommentText] = useState(""); // Store new text for editing
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [isHelpful, setIsHelpful] = useState(false);
    const [showReplyForm, setShowReplyForm] = useState(null);
    const [replyContent, setReplyContent] = useState("");
    const [likes, setLikes] = useState(0);
    const [isLiked, setIsLiked] = useState(false); 
    const [isFollowing, setIsFollowing] = useState(false);
    const [followNotification, setFollowNotification] = useState('');
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

    useEffect(() => {
        if (post) {
            setLikes(post.likes_count || 0);
            setIsLiked(post.is_liked || false);
            setIsFollowing(post.is_following || false);
        }
    }, [post]);

    async function handleDeleteComment(commentId) {
        let token = localStorage.getItem("access");
        if (!token) return;

        if (!window.confirm(t('post.deleteConfirm'))) return;

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

    const handleReaction = async (type) => {
        let token = localStorage.getItem("access");
        if (!token) return;

        try {
            const response = await fetch(`http://localhost:8000/api/community/posts/${id}/react/`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ reaction_type: type })
            });

            if (!response.ok) {
                throw new Error("Failed to react to post");
            }

            const data = await response.json();
            setIsHelpful(data.is_helpful);
            // Optionally update likes count in the UI
            if (post) {
                setPost({...post, likes_count: data.likes_count});
            }
        } catch (error) {
            console.error("Error reacting to post:", error);
        }
    };

    const handleReply = async (commentId) => {
        let token = localStorage.getItem("access");
        if (!token || !user) return;

        try {
            const response = await fetch(`http://localhost:8000/api/community/comments/${commentId}/reply/`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ content: replyContent })
            });

            if (!response.ok) throw new Error("Failed to post reply");

            const newReply = await response.json();
            setComments(comments.map(comment => 
                comment.id === commentId 
                    ? { ...comment, replies: [...(comment.replies || []), newReply] }
                    : comment
            ));
            setShowReplyForm(null);
            setReplyContent("");
        } catch (error) {
            console.error("Error posting reply:", error);
        }
    };

    const handleLike = async () => {
        let token = localStorage.getItem("access");
        if (!token) return;

        try {
            const response = await fetch(`http://localhost:8000/api/community/posts/${id}/like/`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) throw new Error("Failed to like post");

            const data = await response.json();
            setLikes(data.likes_count);
            setIsLiked(!isLiked);
        } catch (error) {
            console.error("Error liking post:", error);
        }
    };

    const handleFollow = async () => {
        let token = localStorage.getItem("access");
        if (!token) return;

        try {
            const response = await fetch(`http://localhost:8000/api/community/posts/${id}/follow/`, {
                method: "POST", 
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) throw new Error("Failed to follow discussion");

            const data = await response.json();
            setIsFollowing(!isFollowing);
            setFollowNotification(
                isFollowing ? 
                'You will no longer receive notifications for this discussion' : 
                'You will receive notifications when new comments are added'
            );

            // Hide notification after 3 seconds
            setTimeout(() => setFollowNotification(''), 3000);
        } catch (error) {
            console.error("Error following discussion:", error);
        }
    };

    return (
        <div className="post-detail-container">
            {loading ? <p>{t('post.loading')}</p> : error ? <p className="error">{error}</p> : (
                <>
                    <div className="post-header">
                        <div className="user-avatar">
                            {/* If you have user avatar, add it here */}
                        </div>
                        <div className="post-user-info">
                            <a href="#" className="post-username">{post?.username}</a>
                            <div className="post-meta">
                                {new Date(post?.created_at).toLocaleDateString()}
                            </div>
                        </div>
                    </div>

                    <p className="post-content">{post?.content}</p>

                    <div className="post-actions">
                        <button onClick={handleLike}>
                            {isLiked ? '❤️' : '🤍'}
                            <span>{likes} {likes === 1 ? t('post.like') : t('post.likes')}</span>
                        </button>
                        <button onClick={handleFollow}>
                            {isFollowing ? '🔔' : '🔕'}
                            <span>{isFollowing ? t('post.following') : t('post.follow')}</span>
                        </button>
                    </div>

                    <div className="comments-section">
                        <h3>{t('post.comments')}</h3>
                        {comments.map((comment) => (
                            <div key={comment.id} className="comment">
                                <div className="comment-content">
                                    <span className="comment-username">{comment.user?.username}</span>
                                    <span className="comment-text">{comment.content}</span>
                                </div>
                                {user && comment.user?.username === user.username && (
                                    <div className="comment-actions">
                                        <button onClick={() => setEditingComment(comment.id)}>Edit</button>
                                        <button onClick={() => handleDeleteComment(comment.id)}>Delete</button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <form className="comment-form" onSubmit={handleCommentSubmit}>
                        <textarea
                            placeholder={t('post.addComment')}
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        />
                        <button type="submit" disabled={!newComment.trim()}>
                            {t('post.post')}
                        </button>
                    </form>

                    {followNotification && (
                        <div className="notification">
                            {followNotification}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default PostDetail;
