import React, { useState, useEffect, useRef } from 'react';
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
      image: mamaImage,
      alt: 'Community Support',
      title: 'Connect with Other Moms',
      desc: 'Join our vibrant community of mothers to share experiences and find support.'
    },
    {
      path: "/support",
      image: supportImage,
      alt: 'Support Services',
      title: 'Support Services',
      desc: 'Access comprehensive support services for your pregnancy journey.'
    },
    {
      path: "/resources",
      image: communityImage,
      alt: 'Resources',
      title: 'Helpful Resources',
      desc: 'Find expert-curated resources and guides for pregnancy and motherhood.'
    },
    {
      path: "/healthcare",
      image: professionalImage,
      alt: 'Healthcare',
      title: 'Healthcare Access',
      desc: 'Connect with healthcare professionals for personalized care.'
    },
    {
      path: "/mental-health",
      image: mentalHealthImage,
      alt: 'Mental Health',
      title: 'Mental Wellness',
      desc: 'Get support for your mental health during pregnancy and postpartum.'
    },
    {
      path: "/pregnancy-tips",
      image: pregnancyTipsImage,
      alt: 'Pregnancy Tips',
      title: 'Pregnancy Guide',
      desc: 'Essential tips and guidance for a healthy pregnancy.'
    }
  ];

  const resources = [
    {
      image: mentalHealthImage,
      title: 'Mental Health Support',
      description: 'Access comprehensive resources for emotional well-being during pregnancy and postpartum. Get expert guidance on managing stress, anxiety, and depression.',
      link: '/mental-health'
    },
    {
      image: pregnancyTipsImage,
      title: 'Pregnancy Care Guide',
      description: 'Essential tips and information for a healthy pregnancy. Learn about nutrition, exercise, and important milestones throughout your journey.',
      link: '/pregnancy-tips'
    },
    {
      image: supportImage,
      title: 'Community Support',
      description: 'Connect with other moms, share experiences, and get advice from our supportive community. Join discussions and find local support groups.',
      link: '/community'
    }
  ];

  const videos = [
    {
      url: "https://www.youtube.com/embed/CBbYbOni_Kg",
      title: "Understanding Postpartum Care",
      description: "Learn essential tips and practices for postpartum care and recovery. This comprehensive guide will help you navigate the postpartum period with confidence."
    },
    {
      url: "https://www.youtube.com/embed/dMw6m3MJ-uE",
      title: "Mental Health During Pregnancy",
      description: "Understanding and managing mental health throughout your pregnancy journey. Get expert advice on emotional well-being during pregnancy."
    },
    {
      url: "https://www.youtube.com/embed/3jYYT_rf7Sw",
      title: "Breastfeeding Tips",
      description: "Helpful guidance and tips for successful breastfeeding practices. Learn proper techniques and common solutions to breastfeeding challenges."
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

  return (
    <div className="home-container">
      <Navbar />

      {/* Hero Section */}
      <section className="hero-section" style={{ backgroundImage: `url(${communityImage})` }}>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">Sema Mama</h1>
          <p className="hero-message">{t('home.message')}</p>
          {!isAuthenticated && (
            <Link to="/login" className="cta-button">
              {t('home.joinCommunity')}
            </Link>
          )}
        </div>
      </section>

      {/* Quick Access Cards with Enhanced Carousel */}
      <section className="support-options">
        <h2>{t('home.helpTitle')}</h2>
        <div className="support-cards">
          <div className="carousel-container">
            {cards.map((card, index) => (
              <Link 
                key={index}
                to={handleAuthenticatedLink(card.path)} 
                className={`support-card ${index === currentCardIndex ? 'active' : ''}`}
                style={{
                  transform: `translateX(${(index - currentCardIndex) * 100}%)`,
                  opacity: index === currentCardIndex ? 1 : 0.5
                }}
              >
                <img 
                  src={card.image} 
                  alt={t(card.alt)} 
                  className="card-image" 
                />
                <div className="card-content">
                  <h3>{t(card.title)}</h3>
                  <p>{t(card.desc)}</p>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="carousel-controls">
            <button 
              className="carousel-button prev"
              onClick={() => setCurrentCardIndex((prev) => (prev - 1 + cards.length) % cards.length)}
            >
              &#8249;
            </button>
            <div className="card-indicators">
              {cards.map((_, index) => (
                <span
                  key={index}
                  className={`card-dot ${currentCardIndex === index ? 'active' : ''}`}
                  onClick={() => setCurrentCardIndex(index)}
                />
              ))}
            </div>
            <button 
              className="carousel-button next"
              onClick={() => setCurrentCardIndex((prev) => (prev + 1) % cards.length)}
            >
              &#8250;
            </button>
          </div>
        </div>
      </section>

      {/* Enhanced Video Gallery */}
      <section className="featured-section">
        <h2>{t('featured.title')}</h2>
        <div className="video-grid">
          {videos.map((video, index) => (
            <div key={index} className="video-item">
              <iframe
                src={video.url}
                title={video.title}
                allowFullScreen
              ></iframe>
              <div className="video-content">
                <h3>{video.title}</h3>
                <p>{video.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Additional Resources Gallery */}
      <section className="resources-preview">
        <h2>{t('resources.quickAccess')}</h2>
        <div className="resources-grid">
          {resources.map((resource, index) => (
            <Link to={resource.link} key={index} className="resource-item">
              <img src={resource.image} alt={resource.title} />
              <div className="resource-content">
                <h3>{resource.title}</h3>
                <p>{resource.description}</p>
                <span className="resource-link">Learn More →</span>
              </div>
            </Link>
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
