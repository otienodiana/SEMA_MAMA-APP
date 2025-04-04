import React, { useState, useEffect } from "react";
import axios from "axios";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { FaEllipsisV } from 'react-icons/fa';
import config from '../config/config';
import "./momDashboard.css";

function MomDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [educationalContent, setEducationalContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);

  useEffect(() => {
    const fetchEducationalContent = async () => {
      try {
        const token = localStorage.getItem('access');
        const response = await axios.get(`${config.API_URL}/api/content/contents/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setEducationalContent(response.data);
      } catch (err) {
        setError('Failed to load educational content');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEducationalContent();
  }, []);

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
          <li><Link to="appointments">{t('dashboard.appointments')}</Link></li>
          <li><Link to="settings">{t('dashboard.settings')}</Link></li>
          <li><Link to="logout">{t('dashboard.logout')}</Link></li>
        </ul>
      </nav>

      <div className="mom-dashboard-content">
        {loading ? (
          <div>Loading educational content...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="educational-content">
            <div className="content-grid">
              {educationalContent.map(content => (
                <div key={content.id} className="content-card">
                  <h3>{content.title}</h3>
                  <p>{content.description}</p>
                  {content.content_type === 'image' && (
                    <img src={content.file_url || content.uploaded_file} alt={content.title} />
                  )}
                  {content.content_type === 'video' && (
                    <video controls>
                      <source src={content.file_url || content.uploaded_file} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                  
                  <div className="card-actions">
                    <button 
                      className="menu-dots"
                      onClick={() => setActiveMenu(activeMenu === content.id ? null : content.id)}
                    >
                      <FaEllipsisV />
                    </button>

                    {activeMenu === content.id && (
                      <div className="action-menu">
                        <button onClick={() => window.open(content.file_url || content.uploaded_file, '_blank')}>
                          View
                        </button>
                        <button onClick={() => {
                          const link = document.createElement('a');
                          link.href = content.file_url || content.uploaded_file;
                          link.download = content.title;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}>
                          Download
                        </button>
                        {content.content_type === 'document' && (
                          <button onClick={() => window.open(content.file_url || content.uploaded_file, '_blank')}>
                            Open Document
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="content-meta">
                    <span>Type: {content.content_type}</span>
                    <span>Added: {new Date(content.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
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
