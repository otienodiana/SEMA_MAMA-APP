import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>{t('footer.quickLinks')}</h3>
          <Link to="/">{t('nav.home')}</Link>
          <Link to="/about">{t('nav.about')}</Link>
          <Link to="/resources">{t('nav.resources')}</Link>
        </div>
        
        <div className="footer-section">
          <h3>{t('footer.contact')}</h3>
          <a href="mailto:support@semamama.com">support@semamama.com</a>
          <a href="tel:+123456789">+123 456 789</a>
        </div>
        
        <div className="footer-section">
          <h3>{t('footer.follow')}</h3>
          <a href="https://twitter.com/semamama" target="_blank" rel="noopener noreferrer">Twitter</a>
          <a href="https://facebook.com/semamama" target="_blank" rel="noopener noreferrer">Facebook</a>
          <a href="https://instagram.com/semamama" target="_blank" rel="noopener noreferrer">Instagram</a>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2024 Sema Mama. {t('footer.rights')}</p>
      </div>
    </footer>
  );
};

export default Footer;
