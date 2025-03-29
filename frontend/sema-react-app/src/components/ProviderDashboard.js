import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import "./providerDashboard.css";
import ProviderAppointments from './ProviderAppointments';
import ProviderMessages from './ProviderMessages';

function ProviderDashboard() {
  const { t } = useTranslation();
  const [showMessages, setShowMessages] = useState(false);

  return (
    <div className="provider-dashboard-container">
      <header className="provider-dashboard-header">
        {t('provider.dashboard.header')}
      </header>

      <nav className="provider-dashboard-nav">
        <ul>
          <li><Link to="profile">{t('provider.dashboard.profile')}</Link></li>
          <li><Link to="appointments">{t('provider.dashboard.appointments')}</Link></li>
          <li><Link to="educational-contents">{t('provider.dashboard.healthcorner')}</Link></li>
          <li><Link to="community">{t('provider.dashboard.community')}</Link></li>
          <li><Link to="settings">{t('provider.dashboard.settings')}</Link></li>
          <li><Link to="logout">{t('provider.dashboard.logout')}</Link></li>
        </ul>
      </nav>

      <div className="provider-dashboard-content">
        <Outlet />
      </div>

      {/* Floating chat button */}
      <button 
        className="chat-float-btn"
        onClick={() => setShowMessages(!showMessages)}
        title={t('provider.dashboard.messages')}
      >
        <i className="fas fa-comments"></i>
      </button>

      {/* Messages modal */}
      {showMessages && (
        <div className="messages-modal">
          <div className="messages-content">
            <button className="close-btn" onClick={() => setShowMessages(false)}>×</button>
            <ProviderMessages />
          </div>
        </div>
      )}
    </div>
  );
}

export default ProviderDashboard;
