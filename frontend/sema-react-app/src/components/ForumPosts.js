import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEllipsisV, FaEdit, FaTrash, FaShareAlt, FaDownload } from "react-icons/fa"; 
import Navbar from "./Navbar";
import "./ForumPosts.css";

const ForumPosts = () => {
    const [posts, setPosts] = useState([]);
    const [newTitle, setNewTitle] = useState("");
    const [newContent, setNewContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [menuOpen, setMenuOpen] = useState(null);
    const navigate = useNavigate();
    const [editPostId, setEditPostId] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editContent, setEditContent] = useState("");
    const [editForumId, setEditForumId] = useState(null);
    const [editUserId, setEditUserId] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    

    useEffect(() => {
        fetchUser();
        fetchPosts();
    }, []);

    async function fetchUser() {
        let token = localStorage.getItem("access");
        if (!token) return;
        try {
            const response = await fetch("http://localhost:8000/api/users/me/", {
                method: "GET",
                headers: { "Authorization": `Bearer ${token}` },
            });
            if (!response.ok) throw new Error("Failed to fetch user");
            const userData = await response.json();
            setUser(userData);
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    }

    async function fetchPosts() {
        let token = localStorage.getItem("access");
        if (!token) return;
        try {
            setLoading(true);
            const response = await fetch("http://localhost:8000/api/community/forums/2/posts/", {
                method: "GET",
                headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
            });
            if (!response.ok) throw new Error("Failed to fetch posts");
            const data = await response.json();
            setPosts(data);
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
        const newPostData = { title: newTitle, content: newContent, forum: 2, user: user.id };
        try {
            setLoading(true);
            const response = await fetch("http://localhost:8000/api/community/forums/2/posts/", {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
                body: JSON.stringify(newPostData),
            });
            if (!response.ok) throw new Error("Failed to create post");
            const responseData = await response.json();
            setPosts([...posts, responseData]);
            setNewTitle("");
            setNewContent("");
        } catch (error) {
            console.error("Error creating post:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    const handleDelete = async (postId) => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;
    
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
    if (!window.confirm("Are you sure you want to update this post?")) return;

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

    return (
        <div className="forum-posts-container">
            <h2>Forum Posts</h2>

            {loading && <p className="loading-message">Loading...</p>}
            {error && <p className="error-message">Error: {error}</p>}

            <form onSubmit={handlePostSubmit} className="post-form">
                <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Post Title..." required />
                <textarea value={newContent} onChange={(e) => setNewContent(e.target.value)} placeholder="Write your post..." required></textarea>
                <button type="submit">Post</button>
            </form>

            <div className="posts-grid">
                {posts.map((post) => (
                    <div key={post.id} className="post-card">
                        <h3>{post.title}</h3>
                        <p>{post.content}</p>
                        <p className="post-meta"><strong>Posted by:</strong> {post.username || "Unknown"}</p>

                        <div className="post-actions">
                            <button onClick={() => navigate(`/post/${post.id}`)}>View Post</button>

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
                ))}
            </div>
        </div>
    );
};

export default ForumPosts;
