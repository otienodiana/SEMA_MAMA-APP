import React from "react";
import { Outlet, Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import "./momDashboard.css";
import MomAppointments from "./MomAppointments";

function MomDashboard() {
  const { t } = useTranslation();

  return (
    <div className="mom-dashboard-container">
      <header className="mom-dashboard-header">Moms Dashboard</header>

      <nav className="mom-dashboard-nav">
        <ul>
          <li><Link to="profile">{t('dashboard.profile')}</Link></li>
          <li><Link to="community">{t('dashboard.community')}</Link></li>
          <li><Link to="resources">{t('dashboard.resources')}</Link></li>
          <li><Link to="self-assessment">{t('dashboard.assessment')}</Link></li>
          <li><Link to="Settings">{t('dashboard.settings')}</Link></li>
          <li><Link to="appointments">{t('dashboard.appointments')}</Link></li>
          <li><Link to="logout">{t('dashboard.logout')}</Link></li>
        </ul>
      </nav>

      <div className="mom-dashboard-content">
        <Outlet />
      </div>
    </div>
  );
}

export default MomDashboard;
