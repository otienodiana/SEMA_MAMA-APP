import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Link, Navigate } from 'react-router-dom';
import { BiGlobe } from 'react-icons/bi';
import "./HomePageStyles.css";
import Navbar from "./Navbar";
import mamaImage from "../assets/dep1.jpg";
// Add more image imports
import supportImage from "../assets/dep2.jpg";
import communityImage from "../assets/dep3.jpg";
import professionalImage from "../assets/dep4.jpg";
import mentalHealthImage from "../assets/dep5.jpg";
import pregnancyTipsImage from "../assets/dep6.jpg";

const HomePage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("userToken");
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const handleAuthenticatedLink = (path) => {
    if (!isAuthenticated) {
      return '/login';
    }
    return path;
  };

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
    localStorage.setItem('language', language);
  };

  const toggleLanguageMenu = () => {
    setShowLanguageMenu(!showLanguageMenu);
  };

  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
    },
    header: {
      fontSize: '2.5rem',
      color: '#008DC9',
      marginBottom: '1rem',
      textAlign: 'center',
    },
    subtitle: {
      fontSize: '1.2rem',
      color: '#6c757d',
      marginBottom: '2rem',
      textAlign: 'center',
    },
    languageSection: {
      background: 'white',
      padding: '2rem',
      borderRadius: '10px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      marginBottom: '2rem',
      width: '100%',
      maxWidth: '400px',
    },
    languageTitle: {
      fontSize: '1.2rem',
      color: '#343a40',
      marginBottom: '1rem',
      textAlign: 'center',
    },
    languageButtons: {
      display: 'flex',
      justifyContent: 'center',
      gap: '1rem',
      flexWrap: 'wrap',
    },
    button: {
      padding: '10px 20px',
      border: '2px solid #008DC9',
      borderRadius: '5px',
      background: 'transparent',
      color: '#008DC9',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      '&:hover': {
        background: '#008DC9',
        color: 'white',
      },
    },
    activeButton: {
      background: '#008DC9',
      color: 'white',
    },
    startButton: {
      padding: '12px 24px',
      background: '#008DC9',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      fontSize: '1.1rem',
      cursor: 'pointer',
      transition: 'background 0.3s ease',
      '&:hover': {
        background: '#006d9f',
      },
    },
    languageSelector: {
      position: 'absolute',
      top: '20px',
      right: '20px',
      zIndex: 1000,
    },
    globeIcon: {
      fontSize: '24px',
      color: '#008DC9',
      cursor: 'pointer',
      padding: '8px',
      borderRadius: '50%',
      backgroundColor: 'white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    languageDropdown: {
      position: 'absolute',
      top: '100%',
      right: '0',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      padding: '8px 0',
      marginTop: '8px',
      display: 'flex',
      flexDirection: 'column',
      minWidth: '120px',
    },
    languageOption: {
      padding: '8px 16px',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: '#f0f0f0',
      },
    },
  };

  return (
    <div className="home-container" style={{ paddingTop: '80px' }}>
      <Navbar />

      <div style={styles.languageSelector}>
        <BiGlobe 
          style={styles.globeIcon} 
          onClick={toggleLanguageMenu}
        />
        {showLanguageMenu && (
          <div style={styles.languageDropdown}>
            <div 
              style={styles.languageOption} 
              onClick={() => {
                changeLanguage('en');
                setShowLanguageMenu(false);
              }}
            >
              English
            </div>
            <div 
              style={styles.languageOption}
              onClick={() => {
                changeLanguage('sw');
                setShowLanguageMenu(false);
              }}
            >
              Kiswahili
            </div>
            <div 
              style={styles.languageOption}
              onClick={() => {
                changeLanguage('fr');
                setShowLanguageMenu(false);
              }}
            >
              Français
            </div>
          </div>
        )}
      </div>

      {/* Hero Section with Enhanced Visuals */}
      <section className="hero-section">
        <div className="hero-content" style={{ textAlign: 'center' }}>
          <h1 style={{ color: '#ffffff' }}>{t('home.welcome')}</h1>
          <p className="hero-message" style={{ color: '#ffffff' }}>
            {t('home.message')}
          </p>
          {!isAuthenticated && (
            <Link to="/login" className="cta-button" style={{ 
              display: 'inline-block',
              margin: '0 auto',
              marginTop: '20px'
            }}>
              {t('home.joinCommunity')}
            </Link>
          )}
        </div>
      </section>

      {/* Quick Access Cards with Authentication Check */}
      <section className="support-options">
        <h2>{t('home.helpTitle')}</h2>
        <div className="support-cards">
          <Link to={handleAuthenticatedLink("/community")} className="support-card">
            <img src={communityImage} alt={t('alt.communitySupport')} className="card-image" />
            <h3>{t('home.talkToMoms')}</h3>
            <p>{t('home.talkToMomsDesc')}</p>
            {!isAuthenticated}
          </Link>

          <Link to="/resources" className="support-card">
            <img src={supportImage} alt={t('alt.resources')} className="card-image" />
            <h3>{t('home.resources')}</h3>
            <p>{t('home.resourcesDesc')}</p>
          </Link>

          <Link to={handleAuthenticatedLink("/appointments")} className="support-card">
            <img src={professionalImage} alt={t('alt.professionalHelp')} className="card-image" />
            <h3>{t('home.professionalHelp')}</h3>
            <p>{t('home.professionalHelpDesc')}</p>
            {!isAuthenticated}
          </Link>
        </div>
      </section>

      {/* Enhanced Video Gallery */}
      <section className="featured-section">
        <h2>Featured Support Videos</h2>
        <div className="video-grid">
          <div className="video-item">
            <iframe
              src="https://www.youtube.com/embed/CBbYbOni_Kg"
              title="Understanding Postpartum Care"
              allowFullScreen
            ></iframe>
            <h3>Understanding Postpartum Care</h3>
          </div>
          <div className="video-item">
            <iframe
              src="https://www.youtube.com/embed/dMw6m3MJ-uE"
              title="Mental Health During Pregnancy"
              allowFullScreen
            ></iframe>
            <h3>Mental Health During Pregnancy</h3>
          </div>
          <div className="video-item">
            <iframe
              src="https://www.youtube.com/embed/3jYYT_rf7Sw"
              title="Breastfeeding Tips"
              allowFullScreen
            ></iframe>
            <h3>Breastfeeding Tips</h3>
          </div>
        </div>
      </section>

      {/* Additional Resources Gallery */}
      <section className="resources-preview">
        <h2>Quick Access Resources</h2>
        <div className="resources-grid">
          <div className="resource-item">
            <img src={mentalHealthImage} alt="Mental Health Support" />
            <h3>Mental Health Support</h3>
            <p>Access resources for emotional wellbeing</p>
          </div>
          <div className="resource-item">
            <img src={pregnancyTipsImage} alt="Pregnancy Tips" />
            <h3>Pregnancy Tips</h3>
            <p>Essential guidance for your journey</p>
          </div>
        </div>
      </section>

      {/* Support Message */}
      <section className="support-message">
        <h2>{t('home.remember')}</h2>
        <p>{t('home.validFeelings')}</p>
        <p>{t('home.supportMessage')}</p>
      </section>


      
    </div>
  );
};

export default HomePage;
