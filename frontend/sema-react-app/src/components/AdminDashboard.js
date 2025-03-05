import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "./Dashboard.css";

const Dashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <nav className="sidebar">
        <h2 className="logo">Sema Mama</h2>
        <ul className="nav-list">
          <li className={location.pathname === "/dashboard" ? "active" : ""}>
            <Link to="/dashboard">🏠 Home</Link>
          </li>
          <li className={location.pathname === "/dashboard/profile" ? "active" : ""}>
            <Link to="/dashboard/profile">👤 Profile</Link>
          </li>
          <li className={location.pathname === "/dashboard/settings" ? "active" : ""}>
            <Link to="/dashboard/settings">⚙️ Settings</Link>
          </li>

          {/* Conditional Navigation Based on Roles */}
          {user.role === "mom" && (
            <>
              <li className={location.pathname === "/dashboard/appointments" ? "active" : ""}>
                <Link to="/dashboard/appointments">📅 Appointments</Link>
              </li>
              <li className={location.pathname === "/dashboard/community" ? "active" : ""}>
                <Link to="/dashboard/community">💬 Community</Link>
              </li>
            </>
          )}

          {user.role === "admin" && (
            <>
              <li className={location.pathname === "/dashboard/analytics" ? "active" : ""}>
                <Link to="/dashboard/analytics">📊 Analytics</Link>
              </li>
              <li className={location.pathname === "/dashboard/admin/community" ? "active" : ""}>
                <Link to="/dashboard/admin/community">👥 Admin Community</Link>
              </li>
            </>
          )}

          <li className={location.pathname === "/dashboard/educational-contents" ? "active" : ""}>
            <Link to="/dashboard/educational-contents">📚 Educational Contents</Link>
          </li>
          <li className={location.pathname === "/dashboard/logout" ? "active" : ""}>
            <Link to="/dashboard/logout">🚪 Logout</Link>
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
