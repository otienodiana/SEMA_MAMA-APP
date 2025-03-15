import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState("mom"); // Default role
  const [age, setAge] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null); // New state for file upload
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate(); // Initialize navigate

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const formData = new FormData(); // Using FormData to handle file uploads

    // Append data to FormData
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("phone_number", phoneNumber);
    formData.append("role", role);
    formData.append("age", age);
    if (profilePhoto) {
      formData.append("profile_photo", profilePhoto); // Append profile photo if selected
    }

    try {
      const response = await fetch("https://sema-mama-app.onrender.com/api/users/register/", {
        method: "POST",
        body: formData, // Send FormData directly
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        throw new Error(errorData.detail || JSON.stringify(errorData));
      }

      const data = await response.json();
      setSuccess("Registration successful! Redirecting to login...");
      console.log("Registration successful:", data);

      // Redirect to login page after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Registration error:", error);
      setError(error.message);
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Register</h2>

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      <form onSubmit={handleRegister} className="register-form" encType="multipart/form-data">
        <div className="form-group">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <input
            type="text"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="role-label">Select your role:</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="form-select"
          >
            <option value="mom">Mom</option>
            <option value="healthcare_provider">Healthcare Provider</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="form-group">
          <input
            type="number"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="role-label">Profile Photo:</label>
          <input
            type="file"
            onChange={(e) => setProfilePhoto(e.target.files[0])}
            accept="image/*"
            className="form-input"
          />
        </div>

        <button type="submit" className="submit-button">
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
