import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getForums, createForum, deleteForum } from "../services/forumService"; // Ensure correct service
import "./Forum.css";

const Forum = () => {
  const [forums, setForums] = useState([]);
  const [newForum, setNewForum] = useState({ name: "", description: "", visibility: "public" });

  useEffect(() => {
    getForums().then((response) => setForums(response.data)).catch(console.error);
  }, []);

  const handleCreateForum = async (e) => {
    e.preventDefault();
    try {
      const response = await createForum(newForum);
      setForums([...forums, response.data]);
      setNewForum({ name: "", description: "", visibility: "public" });
    } catch (error) {
      console.error("Error creating forum:", error);
    }
  };

  const handleDeleteForum = async (id) => {
    try {
      await deleteForum(id);
      setForums(forums.filter((forum) => forum.id !== id));
    } catch (error) {
      console.error("Error deleting forum:", error);
    }
  };

  return (
    <div className="forum-container">
      <h1>Community Forums</h1>
      
      <form onSubmit={handleCreateForum} className="create-forum-form">
        <input type="text" name="name" placeholder="Forum name" value={newForum.name} onChange={(e) => setNewForum({ ...newForum, name: e.target.value })} required />
        <textarea name="description" placeholder="Forum description" value={newForum.description} onChange={(e) => setNewForum({ ...newForum, description: e.target.value })} required />
        <button type="submit">Create Forum</button>
      </form>

      <h2>Available Forums</h2>
      <ul>
        {forums.map((forum) => (
          <li key={forum.id} className="forum-item">
            <Link to={`/forums/${forum.id}`}>
              <h3>{forum.name}</h3>
              <p>{forum.description}</p>
            </Link>
            <button onClick={() => handleDeleteForum(forum.id)} className="delete-btn">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Forum;
