import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { useAuth } from "./AuthContext";
import './Login.css';

function Login() {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth(); // Access login function

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    // Validate input
    if (!username.trim() || !password.trim()) {
      setError(t('login.error.empty'));
      return;
    }

    try {
      console.log("Attempting login for user:", username);

      const response = await fetch("http://localhost:8000/api/users/custom-login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password
        }),
        credentials: 'include'
      });

      const data = await response.json();
      console.log("Login response:", data);

      if (!response.ok) {
        throw new Error(data.detail || "Login failed");
      }

      // Store tokens and user info
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      login(data.user);

      // Navigate based on role
      switch (data.user.role) {
        case "admin":
          navigate("/dashboard/admin");
          break;
        case "healthcare_provider":
          navigate("/dashboard/provider");
          break;
        case "mom":
          navigate("/dashboard/profile");
          break;
        default:
          setError("Unknown role detected");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>{t('login.title')}</h2>
        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder={t('login.username')}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="login-input"
          />
          <input
            type="password"
            placeholder={t('login.password')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="login-input"
          />
          <button type="submit" className="login-button">
            {t('login.button')}
          </button>
        </form>

        <p className="register-link">
          {t('login.register')} <Link to="/register">{t('login.registerLink')}</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
