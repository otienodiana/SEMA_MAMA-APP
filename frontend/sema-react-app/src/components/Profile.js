import React, { useEffect, useState, useCallback } from "react";

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

    try {
      const response = await fetch("http://127.0.0.1:8000/api/users/me/", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
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

  if (loading) return <p className="text-center text-gray-600">Loading user information...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white shadow-lg rounded-lg overflow-hidden p-6">
      <h2 className="text-2xl font-semibold text-center text-gray-800">Profile</h2>

      {user && (
        <div className="text-center">
          <div className="flex justify-center">
            {user.profile_photo ? (
              <img
                src={user.profile_photo}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-gray-300"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                No Photo
              </div>
            )}
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              value={user.username}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="text"
              name="phone_number"
              value={user.phone_number || ""}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Profile Photo</label>
            <input type="file" onChange={handleFileChange} className="mt-1 p-2 w-full" />
          </div>

          <button
            onClick={handleUpdate}
            disabled={updating}
            className="mt-6 w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
          >
            {updating ? "Updating..." : "Update Profile"}
          </button>

          <button
            onClick={handleDelete}
            className="mt-4 w-full bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
          >
            Delete Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
