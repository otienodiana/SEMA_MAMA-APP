import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import './Login.css';

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth(); // Access login function

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null); // Reset error state
  
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json();
      console.log("🔍 Full API Response:", data); // Log entire API response
  
      if (!response.ok) {
        console.error("❌ Login failed:", data);
        setError("Invalid credentials. Please try again.");
        return;
      }
  
      if (!data.user) {
        console.error("❌ No user data found in response", data);
        setError("Login failed: No user data received.");
        return;
      }
  
      if (!data.access) {
        console.error("⚠️ No token received from API", data);
        setError("Login failed: No token received.");
        return;
      }
  
      console.log("✅ Token received:", data.access);
      localStorage.setItem("token", data.token);
  
      console.log("🔹 User role received:", data.user.role);
      login(data.user); // Store user in context
  
      // 🌟 ✅ Added Debugging Fetch Call
      fetch("http://127.0.0.1:8000/api/users/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("✅ API Login Response:", data); // Debugging fetch call
          if (data.access) {
            localStorage.setItem("access", data.access);
           // window.location.href = "/dashboard"; // Redirect on success
          } else {
            alert("Login failed: " + (data.detail || "Invalid credentials"));
          }
        });
  
      // Redirect based on role
      switch (data.user.role) {
        case "admin":
          navigate("/dashboard");
          break;
        case "healthcare_provider":
          navigate("/dashboard/provider");
          break;
        case "mom":
          navigate("/dashboard/profile");
          break;
        default:
          setError("Unknown role detected. Please contact support.");
      }
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
        {success && <p className="success-message">{success}</p>}

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
          Don't have an account?{" "}
          <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
