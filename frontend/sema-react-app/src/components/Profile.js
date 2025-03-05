import React, { useEffect, useState, useCallback } from "react";
import "./Profile.css"; // Import the CSS file

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [updating, setUpdating] = useState(false);

  let token = localStorage.getItem("access");

  // ✅ Fetch user profile from API
  const fetchUserProfile = useCallback(async () => {
    if (!token) {
      setError("No authentication token found.");
      setLoading(false);
      return;
    }

    try {
      let response = await fetch("http://127.0.0.1:8000/api/users/me/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch profile.");
      }

      const data = await response.json();
      setUser(data);
    } catch (err) {
      setError("Failed to load user data.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);

    const formData = new FormData();
    formData.append("username", user.username);
    formData.append("email", user.email);
    formData.append("phone_number", user.phone_number);
    if (selectedFile) {
        formData.append("profile_photo", selectedFile);
    }

    // ✅ Log FormData to Check
    for (let pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]); // Debugging
    }

    try {
        const response = await fetch("http://127.0.0.1:8000/api/users/me/", {
            method: "PUT",
            headers: { Authorization: `Bearer ${token}` }, // ✅ Do NOT set Content-Type manually
            body: formData,
        });

        if (!response.ok) {
            throw new Error("Failed to update profile.");
        }

        alert("Profile updated successfully!");
        fetchUserProfile();
    } catch (err) {
        setError("Profile update failed.");
    } finally {
        setUpdating(false);
    }
};



  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your profile?")) return;

    try {
      const response = await fetch("http://127.0.0.1:8000/api/users/me/", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Failed to delete profile.");
      }

      alert("Profile deleted successfully!");
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      window.location.href = "/login";
    } catch (err) {
      setError("Profile deletion failed.");
    }
  };

  if (loading) return <p className="loading-message">Loading user information...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="profile-container">
      <h2 className="profile-title">My Profile</h2>

      {user && (
        <div className="profile-content">
          <div className="profile-photo-wrapper">
            {user.profile_photo ? (
              <img src={user.profile_photo} alt="Profile" className="profile-photo" />
            ) : (
              <div className="placeholder-photo">No Photo</div>
            )}
          </div>

          <div className="input-group">
            <label>Username</label>
            <input type="text" name="username" value={user.username} onChange={handleChange} />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input type="email" name="email" value={user.email} onChange={handleChange} />
          </div>

          <div className="input-group">
            <label>Phone Number</label>
            <input type="text" name="phone_number" value={user.phone_number || ""} onChange={handleChange} />
          </div>

          <div className="input-group">
            <label>Profile Photo</label>
            <input type="file" onChange={handleFileChange} />
          </div>

          <button onClick={handleUpdate} disabled={updating} className="btn update-btn">
            {updating ? "Updating..." : "Update Profile"}
          </button>

          <button onClick={handleDelete} className="btn delete-btn">
            Delete Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
