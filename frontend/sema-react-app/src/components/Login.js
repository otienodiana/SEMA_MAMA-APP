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
    setError("");

    console.log("Attempting login with:", { username, password });

    try {
      const apiUrl = process.env.REACT_APP_API_BASE_URL;
      console.log("Using API URL:", apiUrl);

      const response = await fetch(`${apiUrl}/users/login/`, {  // Note the trailing slash
        method: "POST",  // Explicitly set POST method
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password
        })
      });

      // Log response status and headers for debugging
      console.log("Response status:", response.status);
      console.log("Response headers:", Object.fromEntries(response.headers));

      const data = await response.json();
      console.log("Response data:", data);

      if (!response.ok) {
        throw new Error(data.detail || "Login failed");
      }

      // Store auth data
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      login(data.user);

      // Navigation based on role
      switch (data.user.role) {
        case "admin":
          navigate("/dashboard/admin");
          break;
        case "healthcare_provider":
          navigate("/dashboard/provider");
          break;
        case "mom":
          navigate("/dashboard/profile"); // Changed from /dashboard/mom to /dashboard/profile
          break;
        default:
          setError("Unknown user role");
      }
    } catch (err) {
      console.error("Login error details:", err);
      setError(err.message || "Login failed. Please try again.");
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
