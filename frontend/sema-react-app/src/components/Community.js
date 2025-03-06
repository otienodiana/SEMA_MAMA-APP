import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Community.css";

const BASE_URL = "http://localhost:8000/api/community";

const Community = () => {
    const [role, setRole] = useState("");
    const [forums, setForums] = useState([]);
    const [joinedForums, setJoinedForums] = useState([]);
    const [newForumName, setNewForumName] = useState("");
    const [newForumDescription, setNewForumDescription] = useState("");
    const [newForumVisibility, setNewForumVisibility] = useState("public");
    const [newForumPicture, setNewForumPicture] = useState(null);
    const [posts, setPosts] = useState([]);  
    const navigate = useNavigate();
    const token = localStorage.getItem("access");

    // Fetch User Role & Joined Forums
    useEffect(() => {
        const fetchUserRole = async () => {
            if (!token) {
                setRole("guest");
                setJoinedForums([]);
                return;
            }

            try {
                const response = await fetch(`${BASE_URL}/users/user-role/`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (!response.ok) throw new Error(`API Error: ${response.status}`);
                const data = await response.json();

                setRole(data.role || "guest");
                setJoinedForums(data.joinedForums || []);
            } catch (error) {
                console.error("Error fetching user role:", error);
                setRole("guest");
                setJoinedForums([]);
            }
        };

        fetchUserRole();
    }, [token]);

    // Fetch All Forums
    useEffect(() => {
        const fetchForums = async () => {
            try {
                const response = await fetch(`${BASE_URL}/forums/`);
                if (!response.ok) throw new Error(`Error fetching forums: ${response.status}`);
                
                const data = await response.json();
                setForums(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Error fetching forums:", error);
                setForums([]);
            }
        };

        fetchForums();
    }, [token]);

    // Fetch All Posts
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch(`${BASE_URL}/posts/`);
                if (!response.ok) throw new Error(`Error fetching posts: ${response.status}`);
                
                const data = await response.json();
                console.log("Fetched Posts:", data);

                setPosts(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Error fetching posts:", error);
                setPosts([]);
            }
        };

        fetchPosts();
    }, []);

    // Join Forum
    const joinForum = async (forumId) => {
        if (!token) {
            alert("You need to be logged in to join a forum!");
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/forums/${forumId}/join/`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) throw new Error("Failed to join forum.");
            setJoinedForums((prev) => [...prev, forumId]);
            alert("Joined forum successfully!");
        } catch (error) {
            console.error("Error joining forum:", error);
            alert("Error joining forum. Please try again.");
        }
    };

    // Create Forum
    const createForum = async (e) => {
        e.preventDefault();
        if (!token) {
            alert("You need to be logged in to create a forum!");
            return;
        }
    
        try {
            let response;
            let formData;
            const createdAt = new Date().toISOString();
    
            console.log("📢 Submitting forum data:", {
                name: newForumName,
                description: newForumDescription,
                visibility: newForumVisibility,
                profile_picture: newForumPicture ? newForumPicture.name : "No image",
                created_at: createdAt, 
            });
    
            if (newForumPicture) {
                formData = new FormData();
                formData.append("name", newForumName);
                formData.append("description", newForumDescription);
                formData.append("visibility", newForumVisibility);
                formData.append("profile_picture", newForumPicture);
                formData.append("created_at", createdAt);
    
                response = await fetch(`${BASE_URL}/forums/`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                    body: formData,
                });
            } else {
                response = await fetch(`${BASE_URL}/forums/`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: newForumName,
                        description: newForumDescription,
                        visibility: newForumVisibility,
                        created_at: createdAt, 
                    }),
                });
            }
    
            const data = await response.json();
    
            if (!response.ok) {
                alert(`Error: ${data.detail || JSON.stringify(data)}`);
                throw new Error(data.detail || "Error creating forum.");
            }
    
            setForums((prev) => [...prev, data]);
            setNewForumName("");
            setNewForumDescription("");
            setNewForumVisibility("public");
            setNewForumPicture(null);
            alert("Forum created successfully!");
        } catch (error) {
            console.error("Error creating forum:", error);
            alert(error.message || "Error creating forum. Please try again.");
        }
    };

    return (
        <div className="community-container">
            <h1>Welcome to the Community</h1>
            <p>Your role: <strong>{role}</strong></p>

            {/* Create Forum Form */}
            {role !== "guest" && (
                <div className="create-forum">
                    <h2>Create a New Forum</h2>
                    <form onSubmit={createForum}>
                        <input 
                            type="text" 
                            placeholder="Forum Name" 
                            value={newForumName} 
                            onChange={(e) => setNewForumName(e.target.value)} 
                            required 
                        />
                        <textarea 
                            placeholder="Forum Description" 
                            value={newForumDescription} 
                            onChange={(e) => setNewForumDescription(e.target.value)} 
                            required 
                        />
                        <select value={newForumVisibility} onChange={(e) => setNewForumVisibility(e.target.value)}>
                            <option value="public">Public</option>
                            <option value="private">Private</option>
                        </select>
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => setNewForumPicture(e.target.files[0])} 
                        />
                        <button type="submit">Create Forum</button>
                    </form>
                </div>
            )}

            {/* Forum List */}
            <h2>Available Forums</h2>
            <div className="forums-grid">
                {forums.map((forum) => (
                    <div key={forum?.id} className="forum-card">
                        <h3>{forum.name}</h3>
                        {joinedForums.includes(forum.id) ? (
                            <button onClick={() => navigate(`/community/forums/${forum.id}/posts`)}>View Posts</button>
                        ) : (
                            <button onClick={() => joinForum(forum.id)}>Join Forum</button>
                        )}
                    </div>
                ))}
            </div>

            {/* Posts Section */}
            <h2>Recent Posts</h2>
            <div className="posts-grid">
                {posts.map((post) => (
                    <div key={post?.id} className="post-card">
                        <h3>{post.title}</h3>
                        <button onClick={() => navigate(`/posts/${post.id}`)}>Read More</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Community;
