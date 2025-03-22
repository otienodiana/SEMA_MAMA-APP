import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { useAuth } from "./AuthContext";
import { API_BASE_URL } from '../config';  // Add this import
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

    try {
      if (!username || !password) {
        setError("Both username and password are required");
        return;
      }

      const data = await login({ username, password });

      if (!data?.user?.role) {
        setError("Invalid user data received");
        return;
      }

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
          setError("Unknown user role");
      }

    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Failed to login. Please check your credentials.");
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
