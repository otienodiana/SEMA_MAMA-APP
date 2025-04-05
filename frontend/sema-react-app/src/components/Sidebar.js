import React from "react";
import { NavLink } from "react-router-dom";
import { FaChartBar, FaUsers, FaCalendarAlt, FaComments, FaBook, FaCog, FaSms, FaSignOutAlt } from "react-icons/fa";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <div className="admin-sidebar">
      <h2 className="sidebar-title">Admin Panel</h2>
      <ul className="sidebar-menu">
        <li><NavLink to="/dashboard/admin" end><FaChartBar /> Analytics</NavLink></li>
        <li><NavLink to="/dashboard/admin/users"><FaUsers /> User Management</NavLink></li>
        <li><NavLink to="/dashboard/admin/appointments"><FaCalendarAlt /> Appointments</NavLink></li>
        <li><NavLink to="/dashboard/admin/community"><FaComments /> Community</NavLink></li>
        <li><NavLink to="/dashboard/admin/educational-contents"><FaBook /> Content</NavLink></li>
        <li><NavLink to="/dashboard/admin/sms-setup"><FaSms /> SMS Setup</NavLink></li>
        <li><NavLink to="/dashboard/admin/settings"><FaCog /> Settings</NavLink></li>
        <li><NavLink to="/dashboard/admin/logout"><FaSignOutAlt /> Logout</NavLink></li>
      </ul>
    </div>
  );
};

export default Sidebar;
