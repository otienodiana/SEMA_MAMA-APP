import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { 
  FaChartBar, 
  FaUser, 
  FaCog, 
  FaCalendarAlt, 
  FaComments, 
  FaBook, 
  FaSignOutAlt,
  FaSms,
  FaUsers,
  FaUsersCog,
  FaUserShield,
  FaUserCheck
} from "react-icons/fa";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: "/dashboard/admin", icon: <FaChartBar />, label: "Analytics" },
    { path: "/dashboard/admin/profile", icon: <FaUser />, label: "Profile" },
    {
      path: "/dashboard/admin/users",
      icon: <FaUsers />,
      label: "User Management",
      subItems: [
        { path: "/dashboard/admin/users/list", icon: <FaUsers />, label: "User List" },
        { path: "/dashboard/admin/users/roles", icon: <FaUserShield />, label: "Roles & Permissions" },
        { path: "/dashboard/admin/users/activity", icon: <FaUserCheck />, label: "User Activity" }
      ]
    },
    { path: "/dashboard/admin/appointments", icon: <FaCalendarAlt />, label: "Appointments" },
    { path: "/dashboard/admin/community", icon: <FaComments />, label: "Community" },
    { path: "/dashboard/admin/educational-contents", icon: <FaBook />, label: "Educational Content" },
    { path: "/dashboard/admin/sms-setup", icon: <FaSms />, label: "SMS Setup" },
    { path: "/dashboard/admin/settings", icon: <FaCog />, label: "Settings" },
    { path: "/dashboard/admin/logout", icon: <FaSignOutAlt />, label: "Logout" }
  ];

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  // Add submenu state
  const [expandedItem, setExpandedItem] = useState(null);

  const toggleSubmenu = (index) => {
    setExpandedItem(expandedItem === index ? null : index);
  };

  return (
    <div className={`admin-dashboard ${collapsed ? 'collapsed' : ''}`}>
      <nav className="admin-sidebar">
        <div className="sidebar-header">
          <h2>{!collapsed && "Admin Panel"}</h2>
          <button className="collapse-btn" onClick={toggleSidebar}>
            {collapsed ? "→" : "←"}
          </button>
        </div>

        <ul className="nav-items">
          {navItems.map((item, index) => (
            <li key={item.path}>
              {item.subItems ? (
                <div>
                  <div 
                    className={`nav-item ${location.pathname.startsWith(item.path) ? 'active' : ''}`}
                    onClick={() => toggleSubmenu(index)}
                  >
                    <span className="icon">{item.icon}</span>
                    {!collapsed && (
                      <>
                        <span className="label">{item.label}</span>
                        <span className={`arrow ${expandedItem === index ? 'expanded' : ''}`}>▼</span>
                      </>
                    )}
                  </div>
                  {expandedItem === index && !collapsed && (
                    <ul className="submenu">
                      {item.subItems.map((subItem) => (
                        <li key={subItem.path}>
                          <Link 
                            to={subItem.path}
                            className={location.pathname === subItem.path ? 'active' : ''}
                          >
                            <span className="icon">{subItem.icon}</span>
                            <span className="label">{subItem.label}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <Link 
                  to={item.path}
                  className={location.pathname === item.path ? 'active' : ''}
                >
                  <span className="icon">{item.icon}</span>
                  {!collapsed && <span className="label">{item.label}</span>}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <main className={`admin-content ${collapsed ? 'expanded' : ''}`}>
        <div className="content-header">
          <h1>
            {navItems.find(item => 
              item.path === location.pathname || 
              (item.subItems && item.subItems.some(sub => sub.path === location.pathname))
            )?.label || "Dashboard"}
          </h1>
        </div>
        <div className="content-body">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
