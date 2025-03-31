import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaEllipsisV, FaEdit, FaTrash, FaShareAlt, FaDownload, FaFilter, FaSort } from "react-icons/fa";
import { useTranslation } from 'react-i18next';
import Navbar from "./Navbar";
import "./ForumPosts.css";

const ForumPosts = () => {
    const { t } = useTranslation();
    const [posts, setPosts] = useState([]);
    const [newTitle, setNewTitle] = useState("");
    const [newContent, setNewContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [menuOpen, setMenuOpen] = useState(null);
    const navigate = useNavigate();
    const { forumId } = useParams(); // Get forumId from URL params
    const [editPostId, setEditPostId] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editContent, setEditContent] = useState("");
    const [editForumId, setEditForumId] = useState(null);
    const [editUserId, setEditUserId] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [message, setMessage] = useState(null);
    const [topicFilter, setTopicFilter] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [topics] = useState([
        'Question',
        'Experience',
        'Advice',
        'Support',
        'General'
    ]);
    const [showPostForm, setShowPostForm] = useState(false);
    const [forumName, setForumName] = useState("");

    useEffect(() => {
        fetchUser();
        if (forumId) {
            fetchForumDetails(forumId);
            fetchPosts(forumId);
        }
    }, [forumId]); // Update dependency array

    async function fetchUser() {
        let token = localStorage.getItem("access");
        if (!token) {
            setError("Authentication required. Please login.");
            return;
        }
        try {
            const response = await fetch("http://localhost:8000/api/users/me/", {
                method: "GET",
                headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
            });
            if (!response.ok) {
                throw new Error("Failed to fetch user");
            }
            const userData = await response.json();
            setUser(userData);
        } catch (error) {
            console.error("Error fetching user:", error);
            setError("Failed to fetch user data");
        }
    }

    async function fetchForumDetails(forumId) {
        let token = localStorage.getItem("access");
        try {
            const response = await fetch(`http://localhost:8000/api/community/forums/${forumId}/`, {
                headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
            });
            if (response.ok) {
                const data = await response.json();
                setForumName(data.name);
            }
        } catch (error) {
            console.error("Error fetching forum details:", error);
        }
    }

    async function fetchPosts(forumId) {
        let token = localStorage.getItem("access");
        if (!token) {
            setError("Authentication required. Please login.");
            return;
        }
        
        try {
            setError(null);
            setLoading(true);
            setMessage(null);

            // First get the currently logged-in user
            const userResponse = await fetch("http://localhost:8000/api/users/me/", {
                headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
            });
            
            if (userResponse.ok) {
                const userData = await userResponse.json();
                setUser(userData);
            }

            const response = await fetch(`http://localhost:8000/api/community/forums/${forumId}/posts/`, {
                headers: { 
                    "Authorization": `Bearer ${token}`, 
                    "Content-Type": "application/json" 
                },
            });

            if (!response.ok) throw new Error(`Server returned ${response.status}: ${response.statusText}`);

            const data = await response.json();
            // Transform the data to ensure we have creator names
            const postsWithCreators = await Promise.all(data.map(async (post) => {
                if (post.user) {
                    const userResponse = await fetch(`http://localhost:8000/api/users/${post.user}/`, {
                        headers: { 
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json"
                        },
                    });
                    if (userResponse.ok) {
                        const userData = await userResponse.json();
                        return {
                            ...post,
                            creator_name: userData.username || userData.email,
                            creator_email: userData.email
                        };
                    }
                }
                return post;
            }));

            // Add comment counts to posts
            const postsWithCommentsCount = await Promise.all(postsWithCreators.map(async (post) => {
                const commentsResponse = await fetch(`http://localhost:8000/api/community/posts/${post.id}/comments/`, {
                    headers: { 
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                });
                
                if (commentsResponse.ok) {
                    const comments = await commentsResponse.json();
                    return {
                        ...post,
                        comments_count: comments.length
                    };
                }
                return post;
            }));

            setPosts(postsWithCommentsCount);
            setMessage("Posts loaded successfully");

        } catch (error) {
            console.error("Error fetching posts:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }
    
    async function handlePostSubmit(e) {
        e.preventDefault();
        let token = localStorage.getItem("access");
        if (!token || !user) return;

        try {
            setLoading(true);
            setError(null);

            const newPostData = { 
                title: newTitle.trim(), 
                content: newContent.trim(), 
                forum: parseInt(forumId)
            };

            console.log('Sending post data:', newPostData);

            // First verify forum exists and user is a member
            const forumCheckResponse = await fetch(`http://localhost:8000/api/community/forums/${forumId}/`, {
                headers: { 
                    "Authorization": `Bearer ${token}`, 
                    "Content-Type": "application/json" 
                },
            });

            if (!forumCheckResponse.ok) {
                throw new Error("Forum not found or you don't have access");
            }

            const response = await fetch(`http://localhost:8000/api/community/forums/${forumId}/posts/`, {
                method: "POST",
                headers: { 
                    "Authorization": `Bearer ${token}`, 
                    "Content-Type": "application/json" 
                },
                body: JSON.stringify(newPostData),
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.detail || responseData.forum?.[0] || "Failed to create post");
            }

            setPosts([responseData, ...posts]);
            setNewTitle("");
            setNewContent("");
            setShowPostForm(false);
            setMessage("Post created successfully! ✅");
                
        } catch (error) {
            console.error("Error creating post:", error);
            setError(error.message || "Failed to create post");
        } finally {
            setLoading(false);
        }
    }

    const handleDelete = async (postId) => {
        if (!window.confirm(t('forumPosts.deleteConfirm'))) return;
    
        let token = localStorage.getItem("access");
    
        try {
            const response = await fetch(`http://localhost:8000/api/community/posts/${postId}/`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` },
            });
    
            if (!response.ok) throw new Error("Failed to delete post");
    
            // ✅ Remove post from state
            setPosts(posts.filter(post => post.id !== postId));
    
            //  Show success message
            alert(" Post deleted successfully!");
    
        } catch (error) {
            console.error(" Error deleting post:", error);
            alert(" Failed to delete post. Please try again.");
        }
    };
    

    const handleUpdatePost = async (postId) => {
    if (!window.confirm(t('forumPosts.updateConfirm'))) return;

    let token = localStorage.getItem("access");
    const post = posts.find(p => p.id === postId);
    if (!post) {
        alert(" Post not found!");
        return;
    }

    const requestData = {
        title: editTitle || post.title,   // Keep old title if empty
        content: editContent || post.content,  // Keep old content if empty
        forum: editForumId || post.forum?.id,  // Use existing forum ID
        user: editUserId || post.user?.id     // Ensure this exists
    };

    console.log(" Sending Data:", requestData); // ✅ Debugging step

    try {
        const response = await fetch(`http://localhost:8000/api/community/posts/${postId}/`, {
            method: "PUT",
            headers: { 
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestData),
        });

        const responseText = await response.text();  // ✅ Get raw response

        if (!response.ok) {
            console.error("🚨 API Error:", responseText);  // ✅ Log the actual error
            alert(` Failed to update post: ${responseText}`);
            return;
        }

        //  Update the post in the state
        setPosts(posts.map(post => 
            post.id === postId ? { ...post, title: editTitle, content: editContent } : post
        ));

        alert(" Post updated successfully!");
        setShowEditModal(false);
    } catch (error) {
        console.error(" Fetch Error:", error);
        alert(" Failed to update post. Please try again.");
    }
};

    const filterPosts = (posts) => {
        if (topicFilter === 'all') return posts;
        return posts.filter(post => post.topic === topicFilter);
    };

    const sortPosts = (posts) => {
        switch (sortBy) {
            case 'newest':
                return [...posts].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            case 'oldest':
                return [...posts].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
            case 'mostComments':
                return [...posts].sort((a, b) => (b.comments_count || 0) - (a.comments_count || 0));
            default:
                return posts;
        }
    };

    const handleShare = (postId) => {
        const postUrl = `${window.location.origin}/post/${postId}`;
        navigator.clipboard.writeText(postUrl);
        alert("Post link copied to clipboard!");
    };

    const handleDownload = (post) => {
        const blob = new Blob([JSON.stringify(post, null, 2)], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `post_${post.id}.json`;
        link.click();
    };

    // Update the navigation path based on user role
    const handleViewPost = (postId) => {
        const userRole = user?.role || 'mom'; // Default to mom if role not found
        const basePath = {
            'admin': '/dashboard/admin',
            'healthcare_provider': '/dashboard/provider',
            'mom': '/dashboard/mom'
        }[userRole];
        
        navigate(`${basePath}/post/${postId}`);
    };

    return (
        <div className="forum-posts-container">
            <div className="forum-header">
                <h1>{forumName}</h1>
                <button 
                    className="add-post-button" 
                    onClick={() => setShowPostForm(!showPostForm)}
                >
                    {showPostForm ? 'Cancel' : 'Add Post'}
                </button>
            </div>

            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">Error: {error}</p>}

            <div className="filters-container">
                <div className="filter-group">
                    <label><FaFilter /> {t('forumPosts.filterByTopic')}</label>
                    <select value={topicFilter} onChange={(e) => setTopicFilter(e.target.value)}>
                        <option value="all">{t('forumPosts.allTopics')}</option>
                        {topics.map(topic => (
                            <option key={topic} value={topic}>{topic}</option>
                        ))}
                    </select>
                </div>
                <div className="filter-group">
                    <label><FaSort /> Sort by:</label>
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="mostComments">Most Comments</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <p className="loading-message">{t('forumPosts.loading')}</p>
            ) : (
                <div className="posts-grid">
                    {sortPosts(filterPosts(posts)).map((post) => (
                        <div key={post.id} className="post-card">
                            <div className="post-header">
                                <div className="post-meta-top">
                                    <span className="post-topic">{post.topic}</span>
                                    <span className="post-date">
                                        {new Date(post.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                            <div className="post-content">
                                <h3>{post.title}</h3>
                                <p className="post-text">{post.content}</p>
                            </div>
                            <div className="post-footer">
                                <div className="post-meta">
                                    <span className="post-author">
                                        Posted by: {post.creator_name || "Anonymous"}
                                    </span>
                                    <span className="post-comments">
                                        {post.comments_count || 0} comments
                                    </span>
                                </div>
                                <div className="post-actions">
                                    <button onClick={() => handleViewPost(post.id)}>
                                        View Post
                                    </button>
                                    <div className="action-menu">
                                        <button className="menu-button" onClick={() => setMenuOpen(menuOpen === post.id ? null : post.id)}>
                                            <FaEllipsisV />
                                        </button>
                                        {menuOpen === post.id && (
                                            <div className="dropdown-menu">
                                                <button onClick={() => handleUpdatePost(post.id)}><FaEdit /> Edit</button>
                                                <button onClick={() => handleDelete(post.id)}><FaTrash /> Delete</button>
                                                <button onClick={() => handleShare(post.id)}><FaShareAlt /> Share</button>
                                                <button onClick={() => handleDownload(post)}><FaDownload /> Download</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showPostForm && (
                <form onSubmit={handlePostSubmit} className="post-form">
                    <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Post Title..." required />
                    <select value={topicFilter} onChange={(e) => setTopicFilter(e.target.value)} required>
                        {topics.map(topic => (
                            <option key={topic} value={topic}>{topic}</option>
                        ))}
                    </select>
                    <textarea value={newContent} onChange={(e) => setNewContent(e.target.value)} placeholder="Write your post..." required></textarea>
                    <button type="submit">Post</button>
                </form>
            )}
        </div>
    );
};

export default ForumPosts;
