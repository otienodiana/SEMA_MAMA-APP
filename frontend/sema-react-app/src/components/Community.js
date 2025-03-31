import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { FaEllipsisV } from 'react-icons/fa';
import { useAuth } from "./AuthContext"; // Change this line to use correct path
import "./Community.css";

const BASE_URL = "http://localhost:8000/api/community";

const Community = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user } = useAuth(); // Add this line
    const [forums, setForums] = useState([]);
    const [joinedForums, setJoinedForums] = useState([]);
    const [newForumName, setNewForumName] = useState("");
    const [newForumDescription, setNewForumDescription] = useState("");
    const [newForumVisibility, setNewForumVisibility] = useState("public");
    const [newForumPicture, setNewForumPicture] = useState(null);
    const [forumFilter, setForumFilter] = useState('all');
    const [forumCategory, setForumCategory] = useState('general');
    const [activeMenu, setActiveMenu] = useState(null);
    const [showAddMemberForm, setShowAddMemberForm] = useState(false);
    const categories = [
        'Pregnancy',
        'Postpartum',
        'Parenting',
        'Mental Health',
        'General'
    ];
    const token = localStorage.getItem("access");

    // Fetch All Forums
    useEffect(() => {
        const fetchForums = async () => {
            try {
                const token = localStorage.getItem("access");
                if (!token) {
                    console.warn("No auth token found");
                    return;
                }
            
                const response = await fetch(`${BASE_URL}/forums/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            
                const data = await response.json();
                setForums(data);
            } catch (error) {
                console.error("Error fetching forums:", error);
                setForums([]); // Set empty array instead of failing
            }
        };
    
        fetchForums();
    }, [token]);
    

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

    // Join Forum
    const [currentForum, setCurrentForum] = useState(null); // Store the current forum when joined

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
                // Handle both cases - already member and just joined
                if (data.status === "already_member" || data.status === "joined") {
                    setJoinedForums(prev => prev.includes(forumId) ? prev : [...prev, forumId]);
                    navigate(`/community/forums/${forumId}/posts`);
                    return;
                }
            }
            
            throw new Error(data.message || "Failed to join forum");
        } catch (error) {
            console.error("Error joining forum:", error);
            alert(error.message || "An unexpected error occurred. Please try again.");
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
            let formData = new FormData();

            formData.append("name", newForumName);
            formData.append("description", newForumDescription);
            formData.append("visibility", newForumVisibility);
            if (newForumPicture) formData.append("profile_picture", newForumPicture);
            formData.append("category", forumCategory);
    
            response = await fetch(`${BASE_URL}/forums/`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` },
                body: formData,
            });

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
            alert("Error creating forum. Please try again.");
        }
    };

    const handleEdit = (community) => {
        console.log("Edit community:", community);
    };

    const handleDelete = (communityId) => {
        console.log("Delete community with ID:", communityId);
    };

    const handleShare = (community) => {
        console.log("Share community:", community);
    };

    const handleExitForum = (forumId) => {
        console.log("Exit forum with ID:", forumId);
    };

    return (
        <div className="community-container">
            <h1>{t('community.title')}</h1>
            <button onClick={() => navigate('/forums')} className="view-forums-btn">
                {t('community.viewAllForums')}
            </button>

            <div className="forum-filters">
                <select value={forumFilter} onChange={(e) => setForumFilter(e.target.value)}>
                    <option value="all">{t('community.allForums')}</option>
                    <option value="my">{t('community.myForums')}</option>
                    <option value="popular">{t('community.popularForums')}</option>
                </select>
            </div>

            {/* Create Forum Form */}
            {token && (
                <div className="create-forum">
                    <h2>{t('community.createForum')}</h2>
                    <form onSubmit={createForum}>
                        <input 
                            type="text" 
                            placeholder={t('community.forumName')}
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
                        <select 
                            value={forumCategory} 
                            onChange={(e) => setForumCategory(e.target.value)}
                            required
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat.toLowerCase()}>{cat}</option>
                            ))}
                        </select>
                        <button type="submit">Create Forum</button>
                    </form>
                </div>
            )}

            {/* Category Sections */}
            {categories.map(category => (
                <div key={category} className="forum-category-section">
                    <h2>{category}</h2>
                    <div className="forums-grid">
                        {forums
                            .filter(forum => forum.category === category.toLowerCase())
                            .map(forum => (
                                <div key={forum?.id} className="forum-card">
                                    {/* Forum Profile Picture */}
                                    {forum.profile_picture ? (
                                        <img src={`${BASE_URL}${forum.profile_picture}`} alt="Forum" className="forum-image" />
                                    ) : (
                                        <div className="forum-placeholder">No Image</div>
                                    )}

                                    <div className="card-header">
                                        <h3>{forum.name}</h3>
                                        <button 
                                            className="menu-dots"
                                            onClick={() => setActiveMenu(activeMenu === forum.id ? null : forum.id)}
                                        >
                                            <FaEllipsisV />
                                        </button>
                                    </div>

                                    <div className="card-content">
                                        <p>{forum.description}</p>
                                        <p><strong>Visibility:</strong> {forum.visibility}</p>
                                        <p><strong>Created By:</strong> {forum.created_by || "Unknown"}</p>
                                    </div>

                                    {activeMenu === forum.id && (
                                        <div className="action-menu">
                                            {forum.is_member ? (
                                                <>
                                                    <button onClick={() => navigate(`/community/forums/${forum.id}/posts`)}>
                                                        View Posts
                                                    </button>
                                                    <button onClick={() => setShowAddMemberForm(true)}>
                                                        Add Member
                                                    </button>
                                                    <button onClick={() => handleExitForum(forum.id)}>
                                                        Exit Forum
                                                    </button>
                                                </>
                                            ) : (
                                                <button onClick={() => joinForum(forum.id)}>
                                                    Join Forum
                                                </button>
                                            )}
                                            {(user?.role === 'admin' || forum.created_by === user?.id) && (
                                                <>
                                                    <button onClick={() => handleEdit(forum)}>Edit</button>
                                                    <button onClick={() => handleDelete(forum.id)}>Delete</button>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Community;
