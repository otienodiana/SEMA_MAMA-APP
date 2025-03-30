import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { useAuth } from "./AuthContext";
import './Login.css';

function Login() {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  
  // Check if current path is admin route
  const isAdminRoute = window.location.pathname.includes('/admin/');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await login({ 
        username, 
        password,
        is_admin_login: isAdminRoute
      });

      if (!data.user || !data.user.role) {
        setError("Invalid response from server");
        return;
      }

      if (data.user.role === 'admin') {
        navigate('/dashboard/admin', { replace: true });
      } else {
        switch (data.user.role) {
          case "healthcare_provider":
            navigate("/dashboard/provider");
            break;
          case "mom":
            navigate("/dashboard/profile");
            break;
          default:
            setError("Invalid user role");
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Failed to login. Please check your credentials and try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>{isAdminRoute ? t('login.adminTitle') : t('login.title')}</h2>
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
          <div className="form-group">
            <input
              type="password"
              placeholder={t('login.password')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={`login-input ${error && error.includes('password') ? 'error' : ''}`}
            />
            {error && error.includes('password') && (
              <small className="error-text">{error}</small>
            )}
          </div>
          <button type="submit" className="login-button">
            {t('login.button')}
          </button>
        </form>

        <p className="register-link">
          {t('login.register')} {' '}
          <Link to={isAdminRoute ? "/admin/register" : "/register"}>
            {t('login.registerLink')}
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
