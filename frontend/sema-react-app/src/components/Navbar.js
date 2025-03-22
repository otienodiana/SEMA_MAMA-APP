import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { useAuth } from "./AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const getDashboardPath = () => {
    if (!user) return '/login';
    
    switch (user.role) {
      case 'admin':
        return '/dashboard/admin';
      case 'healthcare_provider':
        return '/dashboard/provider';
      case 'mom':
        return '/dashboard/profile';
      default:
        return '/login';
    }
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">{t('nav.home')}</Link>
      <div className="nav-links">
        <Link to="/about" className="nav-link">{t('nav.about')}</Link>
        <Link to="/resources" className="nav-link">{t('nav.resources')}</Link>
         
      </div>
    </nav>
  );
};

export default Navbar;
