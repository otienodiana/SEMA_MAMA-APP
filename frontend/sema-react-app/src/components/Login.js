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
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  
  // Check if current path is admin route
  const isAdminRoute = window.location.pathname.includes('/admin/');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await login({ 
        username, 
        password,
        is_admin_login: isAdminRoute
      });

      if (!data.user || !data.user.role) {
        setError("Unable to retrieve user information");
        return;
      }

      // Handle navigation
      const roleRoutes = {
        admin: '/dashboard/admin',
        healthcare_provider: '/dashboard/provider',
        mom: '/dashboard/profile'
      };

      const targetRoute = roleRoutes[data.user.role];
      if (targetRoute) {
        navigate(targetRoute, { replace: true });
      } else {
        setError("Invalid user role");
      }
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
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
            disabled={loading}
            className="login-input"
          />
          <div className="form-group">
            <input
              type="password"
              placeholder={t('login.password')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className={`login-input ${error && error.includes('password') ? 'error' : ''}`}
            />
          </div>
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? t('login.loading') : t('login.button')}
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
