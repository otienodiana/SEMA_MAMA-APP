import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "./AuthContext"; // Import AuthContext

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
      const response = await fetch("http://127.0.0.1:8000/api/users/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json();
      console.log("🔍 Full API Response:", data); // Log entire API response
  
      if (!response.ok) {
        console.error(" Login failed:", data);
        setError("Invalid credentials. Please try again.");
        return;
      }
  
      if (!data.user) {
        console.error(" No user data found in response", data);
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
  
      console.log(" User role received:", data.user.role);
      login(data.user); // Store user in context
  
      // Redirect based on role
      switch (data.user.role) {
        case "admin":
          navigate("/dashboard");
          break;
        case "healthcare_provider":
          navigate("/dashboard/analytics");
          break;
        case "mom":
          navigate("/dashboard/profile");
          break;
        default:
          setError("Unknown role detected. Please contact support.");
      }
    } catch (err) {
      console.error(" Network or Server Error:", err);
      setError("Server error. Please try again later.");
    }
  };
  

  return (
    <div
      style={{
        backgroundImage: "url('/background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(239, 245, 254, 0.9)",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
          width: "400px",
          textAlign: "center",
        }}
      >
        <h2>Login</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{
              display: "block",
              marginBottom: "10px",
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              display: "block",
              marginBottom: "10px",
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              backgroundColor: "#102851",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            Login
          </button>
        </form>

        {/* Don't have an account? Register link */}
        <p style={{ marginTop: "15px" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "#102851", fontWeight: "bold" }}>
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
