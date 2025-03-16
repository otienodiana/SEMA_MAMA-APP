import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import './Login.css';

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth(); // Access login function

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("API URL:", process.env.REACT_APP_API_BASE_URL); // Debug log
    setError(""); // Reset error state

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/users/login`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ username, password }), 
      });

      const data = await response.json();
      console.log("🔍 API Response:", data);

      if (!response.ok) {
        setError(data.detail || "Invalid credentials. Please try again.");
        return;
      }

      if (!data.user || !data.access) {
        setError("Login failed: Missing user data or token.");
        return;
      }

      // Store tokens and user info
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      login(data.user); // Store user in context

      // Redirect based on user role
      const userRole = data.user.role;
      if (userRole === "admin") navigate("/admin/dashboard");
      else if (userRole === "healthcare_provider") navigate("/provider/dashboard");
      else if (userRole === "mom") navigate("/profile/dashboard");
      else setError("Unknown role detected. Please contact support.");
      
    } catch (err) {
      console.error("❌ Network or Server Error:", err);
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="login-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="login-input"
          />
          <button type="submit" className="login-button">
            Login
          </button>
        </form>

        <p className="register-link">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
