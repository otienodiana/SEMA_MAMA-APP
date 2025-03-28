import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import "./momDashboard.css";

function MomDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="mom-dashboard-container">
      <header className="mom-dashboard-header">
        <span>Moms Dashboard</span>
      </header>

      <nav className="mom-dashboard-nav">
        <ul>
          <li><Link to="profile">{t('dashboard.profile')}</Link></li>
          <li><Link to="educational-contents">{t('dashboard.resources')}</Link></li>
          <li><Link to="community">{t('dashboard.community')}</Link></li>
          <li><Link to="self-assessment">My Daily Logs</Link></li>
          <li><Link to="settings">{t('dashboard.settings')}</Link></li>
          <li><Link to="appointments">{t('dashboard.appointments')}</Link></li>
          <li><Link to="logout">{t('dashboard.logout')}</Link></li>
        </ul>
      </nav>

      <div className="mom-dashboard-content">
        <Outlet />
      </div>

      <button 
        className="floating-chat-button"
        onClick={() => navigate('chat')}
        title="Chat with Healthcare Provider"
      >
        <i className="fas fa-comments"></i>
      </button>
    </div>
  );
}

export default MomDashboard;
