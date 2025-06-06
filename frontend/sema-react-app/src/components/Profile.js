import React, { useEffect, useState, useCallback } from "react";
import { useTranslation } from 'react-i18next';
import { API_BASE_URL, getMediaUrl } from '../config';  // Update import
import "./Profile.css"; // Import the CSS file

const Profile = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [updating, setUpdating] = useState(false);

  const fetchUserProfile = useCallback(async () => {
    const token = localStorage.getItem("access");
    
    if (!token) {
      setError("No authentication token found.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/me/`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await response.json();
      console.log("Profile data:", data);
      setUser(data);
      
    } catch (err) {
      console.error("Profile fetch error:", err);
      setError("Failed to load user data");
    } finally {
      setLoading(false);
    }
  }, []);

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
    setError(''); // Clear any previous errors
    const token = localStorage.getItem("access");

    const formData = new FormData();
    formData.append("username", user.username);
    formData.append("email", user.email);
    if (user.phone_number) {
        formData.append("phone_number", user.phone_number);
    }
    if (selectedFile) {
        formData.append("profile_photo", selectedFile);
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/users/me/`, {
            method: "PUT",
            headers: { 
                Authorization: `Bearer ${token}`
                // Don't set Content-Type - browser will set it automatically for FormData
            },
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "Failed to update profile");
        }

        const updatedUser = await response.json();
        console.log("Updated profile data:", updatedUser);
        setUser(updatedUser);
        setSelectedFile(null);
        alert("Profile updated successfully!");
        
        // Reload profile data to ensure we have latest image URL
        await fetchUserProfile();
    } catch (err) {
        console.error("Update error:", err);
        setError(err.message || "Profile update failed");
    } finally {
        setUpdating(false);
    }
};

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your profile?")) return;
    const token = localStorage.getItem("access"); // Add token declaration

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

  if (loading) return <p className="loading-message">{t('profile.loading')}</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="profile-container">
      <h2 className="profile-title">{t('profile.title')}</h2>

      {user && (
        <div className="profile-content">
          <div className="profile-photo-wrapper">
            {user.profile_photo ? (
              <img 
                src={getMediaUrl(user.profile_photo)}
                alt={t('profile.photo')} 
                className="profile-photo" 
              />
            ) : (
              <div className="placeholder-photo">{t('profile.noPhoto')}</div>
            )}
          </div>

          <div className="input-group">
            <label>{t('profile.username')}</label>
            <input type="text" name="username" value={user.username} onChange={handleChange} />
          </div>

          <div className="input-group">
            <label>{t('profile.email')}</label>
            <input type="email" name="email" value={user.email} onChange={handleChange} />
          </div>

          <div className="input-group">
            <label>{t('profile.phoneNumber')}</label>
            <input type="text" name="phone_number" value={user.phone_number || ""} onChange={handleChange} />
          </div>

          <div className="input-group">
            <label>{t('profile.photo')}</label>
            <input type="file" onChange={handleFileChange} />
          </div>

          <button onClick={handleUpdate} disabled={updating} className="btn update-btn">
            {updating ? t('profile.updating') : t('profile.update')}
          </button>

          <button onClick={handleDelete} className="btn delete-btn">
            {t('profile.delete')}
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
