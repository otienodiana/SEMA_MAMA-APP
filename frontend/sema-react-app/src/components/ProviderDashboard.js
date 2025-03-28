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
          <li><Link to="">{t('provider.dashboard.messages')}</Link></li> {/* Default route */}
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

      {/* Floating Message Button */}
      <button 
        className="floating-message-button"
        onClick={() => setShowMessages(!showMessages)}
        title="Chat with Moms"
      >
        <i className="fas fa-comment-dots"></i>
      </button>

      {showMessages && (
        <div className="messages-modal-overlay">
          <div className="messages-modal">
            <button className="close-modal" onClick={() => setShowMessages(false)}>×</button>
            <ProviderMessages />
          </div>
        </div>
      )}
    </div>
  );
}

export default ProviderDashboard;
