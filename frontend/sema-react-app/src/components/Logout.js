import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import "./Logout.css";

const Logout = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <div className="main-content">
        <h1>{t('logout.title')}</h1>
        <p>{t('logout.confirm')}</p>
        <button className="logout-btn" onClick={handleLogout}>
          {t('logout.button')}
        </button>
      </div>
    </div>
  );
};

export default Logout;
