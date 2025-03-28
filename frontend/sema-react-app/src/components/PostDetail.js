import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';  // Add useNavigate
import { FaArrowLeft } from 'react-icons/fa';  // Add icon import
import './PostDetail.css';

const PostDetail = () => {
    const { postId } = useParams();
    const navigate = useNavigate();  // Add this
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPostAndComments();
    }, [postId]);

    const fetchPostAndComments = async () => {
        const token = localStorage.getItem('access');
        try {
            // Fetch post details with forum information
            const postResponse = await fetch(`http://localhost:8000/api/community/posts/${postId}/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!postResponse.ok) throw new Error('Failed to fetch post');
            const postData = await postResponse.json();

            // Fetch forum details
            const forumResponse = await fetch(`http://localhost:8000/api/community/forums/${postData.forum}/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (forumResponse.ok) {
                const forumData = await forumResponse.json();
                postData.forum_name = forumData.name;
            }

            setPost(postData);

            // Fetch comments
            const commentsResponse = await fetch(`http://localhost:8000/api/community/posts/${postId}/comments/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!commentsResponse.ok) throw new Error('Failed to fetch comments');
            const commentsData = await commentsResponse.json();
            setComments(commentsData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('access');
        
        // Get the current user's information
        try {
            const userResponse = await fetch("http://localhost:8000/api/users/me/", {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!userResponse.ok) throw new Error('Failed to get user info');
            const userData = await userResponse.json();

            // Create comment with all required fields
            const commentData = {
                content: newComment,
                post: parseInt(postId),
                user: userData.id,
                creator_name: userData.username || userData.full_name || userData.email
            };

            const response = await fetch(`http://localhost:8000/api/community/posts/${postId}/comments/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(commentData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to post comment');
            }
            
            const newCommentData = await response.json();
            setComments([...comments, newCommentData]);
            setNewComment('');
        } catch (err) {
            setError(err.message);
        }
    };

    const handleBack = () => {
        navigate(-1); // This will take us back to the previous page
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!post) return <div>Post not found</div>;

    return (
        <div className="post-detail-container">
            <button onClick={handleBack} className="back-button">
                <FaArrowLeft /> Back
            </button>
            <div className="forum-name">
                <h2>{post.forum_name}</h2>
            </div>
            <div className="post-content">
                <h1>{post.title}</h1>
                <p>{post.content}</p>
                <p className="post-meta">
                    Posted by: {post.creator_name || post.user?.username || post.user?.full_name || "Anonymous"}
                </p>
            </div>

            <div className="comments-section">
                <h2>Comments</h2>
                <form onSubmit={handleCommentSubmit} className="comment-form">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                        required
                    />
                    <button type="submit">Post Comment</button>
                </form>

                <div className="comments-list">
                    {comments.map((comment) => (
                        <div key={comment.id} className="comment">
                            <p>{comment.content}</p>
                            <p className="comment-meta">
                                By {comment.creator_name || "Unknown"} 
                                on {new Date(comment.created_at).toLocaleDateString()}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PostDetail;
