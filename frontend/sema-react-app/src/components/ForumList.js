import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Community.css";

const BASE_URL = "http://localhost:8000/api/community";

const ForumList = () => {
    const [forums, setForums] = useState([]);
    const [joinedForums, setJoinedForums] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem("access");

    // Fetch All Forums
    useEffect(() => {
        const fetchForums = async () => {
            try {
                const response = await fetch(`${BASE_URL}/forums/`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                });
                if (!response.ok) throw new Error(`Error fetching forums: ${response.status}`);
                
                const forumsData = await response.json();

                // Fetch post counts for each forum
                const forumsWithCounts = await Promise.all(forumsData.map(async (forum) => {
                    const postsResponse = await fetch(`${BASE_URL}/forums/${forum.id}/posts/`, {
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json"
                        },
                    });
                    
                    if (postsResponse.ok) {
                        const posts = await postsResponse.json();
                        return {
                            ...forum,
                            posts_count: Array.isArray(posts) ? posts.length : 0
                        };
                    }
                    return { ...forum, posts_count: 0 };
                }));

                setForums(forumsWithCounts);
            } catch (error) {
                console.error("Error fetching forums:", error);
                setForums([]);
            }
        };

        fetchForums();
    }, []);

    // Fetch Joined Forums
    useEffect(() => {
        if (!token) return;

        const fetchJoinedForums = async () => {
            try {
                const response = await fetch(`${BASE_URL}/users/joined-forums/`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (!response.ok) throw new Error("Failed to fetch joined forums.");
                
                const data = await response.json();
                setJoinedForums(data.joined_forums || []);
            } catch (error) {
                console.error("Error fetching joined forums:", error);
            }
        };

        fetchJoinedForums();
    }, [token]);

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

            const data = await response.json();

            if (response.ok) {
                alert("Successfully joined the forum!");
                setJoinedForums((prev) => [...prev, forumId]);
                navigate(`/community/forums/${forumId}/posts`);
            } else {
                alert("Error joining forum: " + data.detail);
            }
        } catch (error) {
            console.error("Error joining forum:", error);
            alert("An unexpected error occurred. Please try again.");
        }
    };

    return (
        <div className="community-container">
            <h1>Available Forums</h1>
            <div className="forums-grid">
                {forums.map((forum) => (
                    <div key={forum?.id} className="forum-card">
                        {forum.profile_picture ? (
                            <img src={`${BASE_URL}${forum.profile_picture}`} alt="Forum" className="forum-image" />
                        ) : (
                            <div className="forum-placeholder">No Image</div>
                        )}

                        <h3>{forum.name}</h3>
                        <p>{forum.description}</p>
                        <p><strong>Visibility:</strong> {forum.visibility}</p>
                        <p><strong>Created By:</strong> {forum.created_by ? forum.created_by.username : "Unknown"}</p>
                        <div className="forum-stats">
                            <span className="posts-count">
                                {forum.posts_count} Posts
                            </span>
                        </div>

                        {joinedForums.includes(forum.id) ? (
                            <button onClick={() => navigate(`/community/forums/${forum.id}/posts`)}>View Posts</button>
                        ) : (
                            <button onClick={() => joinForum(forum.id)}>Join Forum</button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ForumList;
