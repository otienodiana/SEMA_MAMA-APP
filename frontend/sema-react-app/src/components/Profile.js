import React, { useEffect, useState } from "react";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUserProfile = async () => {
    let token = localStorage.getItem("access");

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
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  if (loading) return <p>Loading user information...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
      <h2>Profile</h2>

      {user ? (
        <div>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email || "No email provided"}</p>
          <p><strong>Phone:</strong> {user.phone_number || "No phone number"}</p>
          <p><strong>Healthcare Provider:</strong> {user.is_healthcare_provider ? "Yes" : "No"}</p>
          <p><strong>Joined:</strong> {user.date_joined ? new Date(user.date_joined).toLocaleDateString() : "N/A"}</p>
          <p><strong>Last Login:</strong> {user.last_login ? new Date(user.last_login).toLocaleDateString() : "N/A"}</p>
          <button onClick={() => alert("Edit Profile Clicked!")}>Edit Profile</button>
        </div>
      ) : (
        <p>No user data available.</p>
      )}
    </div>
  );
};

export default Profile;
