import React, { useState, useEffect } from "react";
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
import axios from "axios";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userPermissions, setUserPermissions] = useState([]);
  const location = useLocation();

  // Fetch user role and permissions
  useEffect(() => {
    const fetchUserPermissions = async () => {
      try {
        const token = localStorage.getItem("access");
        if (!token) {
          console.error("No token found");
          return;
        }

        const response = await axios.get("http://localhost:8000/api/users/my-permissions/", {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        setUserRole(response.data.role);
        setUserPermissions(response.data.permissions || []);
      } catch (error) {
        console.error("Error fetching permissions:", error);
        // Set default permissions for admin
        if (localStorage.getItem('user')) {
          const user = JSON.parse(localStorage.getItem('user'));
          if (user.role === 'admin') {
            setUserRole('admin');
            setUserPermissions(['manage_users', 'manage_content', 'view_analytics']);
          }
        }
      }
    };
    fetchUserPermissions();
  }, []);

  const getMenuItems = () => {
    const baseItems = [
      { path: "/dashboard/admin", icon: <FaChartBar />, label: "Analytics", permission: "view_content" },
      { path: "/dashboard/admin/profile", icon: <FaUser />, label: "Profile", permission: null },
    ];

    const adminItems = [
      {
        path: "/dashboard/admin/users",
        icon: <FaUsers />,
        label: "User Management",
        permission: "manage_users",
        subItems: [
          { path: "/dashboard/admin/users/list", icon: <FaUsers />, label: "User List", permission: "manage_users" },
          { path: "/dashboard/admin/users/roles", icon: <FaUserShield />, label: "Roles & Permissions", permission: "assign_roles" },
          { path: "/dashboard/admin/users/activity", icon: <FaUserCheck />, label: "User Activity", permission: "manage_users" }
        ]
      },
      { path: "/dashboard/admin/educational-contents", icon: <FaBook />, label: "Educational Content", permission: "manage_content" },
      { path: "/dashboard/admin/community", icon: <FaComments />, label: "Community", permission: "manage_forums" },
      { path: "/dashboard/admin/appointments", icon: <FaCalendarAlt />, label: "Appointments", permission: "manage_appointments" },
      { path: "/dashboard/admin/sms-setup", icon: <FaSms />, label: "SMS Setup", permission: "manage_users" },
      { path: "/dashboard/admin/settings", icon: <FaCog />, label: "Settings", permission: "manage_users" },
    ];

    const filteredAdminItems = adminItems.filter(item => {
      if (!item.permission) return true;
      return userPermissions.includes(item.permission);
    });

    return [...baseItems, ...filteredAdminItems, 
      { path: "/dashboard/admin/logout", icon: <FaSignOutAlt />, label: "Logout", permission: null }
    ];
  };

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
          <h2>{!collapsed && `${userRole?.toUpperCase()} Panel`}</h2>
          <button className="collapse-btn" onClick={toggleSidebar}>
            {collapsed ? "→" : "←"}
          </button>
        </div>

        <ul className="nav-items">
          {getMenuItems().map((item, index) => (
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
                      {item.subItems
                        .filter(subItem => !subItem.permission || userPermissions.includes(subItem.permission))
                        .map((subItem) => (
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
            {getMenuItems().find(item => 
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
