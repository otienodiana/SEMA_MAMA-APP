import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Chat.css';

const ChatProviderList = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const token = localStorage.getItem('access');
        const response = await axios.get(
          'http://localhost:8000/api/mama/users/providers/',
          { 
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        console.log('Providers response:', response.data); // Debug log
        setProviders(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching providers:', err.response?.data || err.message);
        setLoading(false);
      }
    };

    fetchProviders();
  }, []);

  if (loading) return <div>Loading providers...</div>;

  return (
    <div className="chat-provider-list">
      <h2>Select a Healthcare Provider to Chat With</h2>
      <div className="providers-grid">
        {providers.map(provider => (
          <Link 
            key={provider.id}
            to={`/dashboard/mom/chat/${provider.id}`}
            className="provider-card"
          >
            <div className="provider-info">
              <h3>{provider.first_name} {provider.last_name}</h3>
              <p>{provider.specialization || 'Healthcare Provider'}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ChatProviderList;
