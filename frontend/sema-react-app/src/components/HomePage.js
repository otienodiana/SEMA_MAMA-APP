import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Link, Navigate } from 'react-router-dom';
import "./HomePageStyles.css";
import Navbar from "./Navbar";
import mamaImage from "../assets/sema1.jpg";
import supportImage from "../assets/sema7.jpg";
import communityImage from "../assets/sema3.jpg";
import professionalImage from "../assets/sema4.png";
import mentalHealthImage from "../assets/sema5.jpg";
import pregnancyTipsImage from "../assets/sema6p.jpg";
import { useAuth } from "./AuthContext";

const HomePage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("userToken");
  const [showForumModal, setShowForumModal] = useState(false);
  const [forums, setForums] = useState([]);
  const [currentForumIndex, setCurrentForumIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [currentResourceIndex, setCurrentResourceIndex] = useState(0);

  const images = [
    mamaImage,
    supportImage,
    communityImage,
    professionalImage,
    mentalHealthImage,
    pregnancyTipsImage
  ];

  const cards = [
    {
      path: "/community",
      image: communityImage,
      alt: 'alt.communitySupport',
      title: 'home.talkToMoms',
      desc: 'home.talkToMomsDesc'
    },
    {
      path: "/resources",
      image: supportImage,
      alt: 'alt.resources',
      title: 'home.resources',
      desc: 'home.resourcesDesc'
    },
    {
      path: "/appointments",
      image: professionalImage,
      alt: 'alt.professionalHelp',
      title: 'home.professionalHelp',
      desc: 'home.professionalHelpDesc'
    }
  ];

  const resources = [
    {
      image: mentalHealthImage,
      title: 'Mental Health Support',
      description: 'Access resources for emotional wellbeing'
    },
    {
      image: pregnancyTipsImage,
      title: 'Pregnancy Tips',
      description: 'Essential guidance for your journey'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCardIndex((prevIndex) => (prevIndex + 1) % cards.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentResourceIndex((prevIndex) => (prevIndex + 1) % resources.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (showForumModal) {
      fetchForums();
    }
  }, [showForumModal]);

  useEffect(() => {
    if (showForumModal && forums.length > 0) {
      const interval = setInterval(() => {
        setCurrentForumIndex((prev) => (prev + 1) % forums.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [showForumModal, forums.length]);

  const fetchForums = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/community/forums/public/');
      setForums(response.data);
    } catch (err) {
      console.error('Error fetching forums:', err);
    }
  };

  const handleAuthenticatedLink = (path) => {
    if (!isAuthenticated) {
      return '/login';
    }
    return path;
  };

  const handleTalkToMomsClick = () => {
    setShowForumModal(true);
  };

  const handleJoinForum = (forumId) => {
    localStorage.setItem('redirectAfterLogin', `/dashboard/mom/community/forums/${forumId}`);
    navigate('/login');
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
  };

  return (
    <div className="home-container" style={{ paddingTop: '80px' }}>
      <Navbar />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content" style={{ textAlign: 'center' }}>
          <h1 style={{ color: '#FFFFFF' }}>Sema Mama</h1>
          <p className="hero-message" style={{ color: '#FFFFFF' }}>
            {t('home.message')}
          </p>
          {!isAuthenticated && (
            <Link to="/login" className="cta-button">
              {t('home.joinCommunity')}
            </Link>
          )}
        </div>
      </section>

      {/* Quick Access Cards with Auto-Switching */}
      <section className="support-options">
        <h2>{t('home.helpTitle')}</h2>
        <div className="support-cards">
          <div className="card-container">
            <Link 
              to={handleAuthenticatedLink(cards[currentCardIndex].path)} 
              className="support-card"
              style={{
                opacity: 1,
                transition: 'opacity 0.5s ease-in-out'
              }}
            >
              <img 
                src={cards[currentCardIndex].image} 
                alt={t(cards[currentCardIndex].alt)} 
                className="card-image" 
              />
              <div className="card-content">
                <h3>{t(cards[currentCardIndex].title)}</h3>
                <p>{t(cards[currentCardIndex].desc)}</p>
              </div>
            </Link>
          </div>
          <div className="card-indicators">
            {cards.map((_, index) => (
              <span
                key={index}
                className={`card-dot ${currentCardIndex === index ? 'active' : ''}`}
                onClick={() => setCurrentCardIndex(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Video Gallery */}
      <section className="featured-section">
        <h2>{t('featured.title')}</h2>
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

      {/* Additional Resources Gallery with Auto-Switching */}
      <section className="resources-preview">
        <h2>{t('resources.quickAccess')}</h2>
        <div className="resources-grid">
          <div 
            className="resource-item"
            style={{
              opacity: 1,
              transition: 'opacity 0.5s ease-in-out'
            }}
          >
            <img 
              src={resources[currentResourceIndex].image} 
              alt={resources[currentResourceIndex].title} 
            />
            <h3>{resources[currentResourceIndex].title}</h3>
            <p>{resources[currentResourceIndex].description}</p>
          </div>
        </div>
        <div className="resource-indicators">
          {resources.map((_, index) => (
            <span
              key={index}
              className={`resource-dot ${currentResourceIndex === index ? 'active' : ''}`}
              onClick={() => setCurrentResourceIndex(index)}
            />
          ))}
        </div>
      </section>

      {/* Footer Section */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-grid">
            <div className="footer-section">
              <h4>{t('footer.quickLinks')}</h4>
              <ul>
                <li><Link to="/about">{t('nav.about')}</Link></li>
                <li><Link to="/community">{t('nav.community')}</Link></li>
                <li><Link to="/resources">{t('nav.resources')}</Link></li>
                <li><Link to="/contact">{t('nav.contact')}</Link></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>{t('footer.support')}</h4>
              <ul>
                <li><Link to="/help">{t('footer.helpCenter')}</Link></li>
                <li><Link to="/terms">{t('footer.terms')}</Link></li>
                <li><Link to="/privacy">{t('footer.privacy')}</Link></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>{t('footer.contact')}</h4>
              <ul>
                <li>{t('footer.email')}</li>
                <li>{t('footer.phone')}</li>
                <li>{t('footer.location')}</li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>{t('footer.copyright')}</p>
            <p>{t('footer.who')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
