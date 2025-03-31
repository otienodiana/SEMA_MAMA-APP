import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { useAuth } from "./AuthContext";
import { BiGlobe } from 'react-icons/bi';
import "./Navbar.css";

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'sw', name: 'Swahili' },
    { code: 'fr', name: 'Français' },
    { code: 'luo', name: 'Dholuo' }
  ];

  const handleLanguageChange = (languageCode) => {
    i18n.changeLanguage(languageCode);
    localStorage.setItem('language', languageCode);
    setShowLanguageMenu(false);
  };

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
      <div className="nav-content">
        <div className="nav-links">
          <Link to="/" className="nav-link">{t('nav.home')}</Link>
          <Link to="/about" className="nav-link">{t('nav.about')}</Link>
          <Link to="/resources" className="nav-link">{t('nav.resources')}</Link>
        </div>

        <div className="language-selector">
          <div className="language-icon" onClick={() => setShowLanguageMenu(!showLanguageMenu)}>
            <BiGlobe size={24} />
          </div>
          {showLanguageMenu && (
            <div className="language-dropdown">
              {languages.map(lang => (
                <div
                  key={lang.code}
                  className="language-option"
                  onClick={() => handleLanguageChange(lang.code)}
                >
                  {lang.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
