import React from "react";
import { Outlet, Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import "./providerDashboard.css";

function ProviderDashboard() {
  const { t } = useTranslation();

  return (
    <div className="provider-dashboard-container">
      <header className="provider-dashboard-header">{t('provider.dashboard.header')}</header>

      <nav className="provider-dashboard-nav">
        <ul>
          <li><Link to="">{t('provider.dashboard.header')}</Link></li>
          <li><Link to="profile">{t('provider.dashboard.profile')}</Link></li>
          <li><Link to="/dashboard/provider/appointments">{t('provider.dashboard.appointments')}</Link></li>
          <li><Link to="educational-contents">{t('provider.dashboard.healthcorner')}</Link></li>
          <li><Link to="community">{t('provider.dashboard.community')}</Link></li>
          <li><Link to="settings">{t('provider.dashboard.settings')}</Link></li>
          <li><Link to="logout">{t('provider.dashboard.logout')}</Link></li>
        </ul>
      </nav>

      <div className="provider-dashboard-content">
        <Outlet />
      </div>
    </div>
  );
}

export default ProviderDashboard;
