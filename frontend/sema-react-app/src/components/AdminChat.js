import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaComments, FaTimes } from 'react-icons/fa';
import './AdminChat.css';

const AdminChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [providers, setProviders] = useState([]);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      fetchProviders();
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 5000); // Poll every 5 seconds
      return () => clearInterval(interval);
    }
  }, [selectedUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchProviders = async () => {
    try {
      const token = localStorage.getItem('access');
      const response = await axios.get('http://localhost:8000/api/users/all/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const healthcareProviders = response.data.users.filter(
        user => user.role === 'healthcare_provider'
      );
      setProviders(healthcareProviders);
    } catch (err) {
      setError('Failed to fetch providers');
      console.error(err);
    }
  };

  const fetchMessages = async () => {
    if (!selectedUser) return;
    
    try {
      const token = localStorage.getItem('access');
      const response = await axios.get(
        `http://localhost:8000/api/mama/chat/history/${selectedUser.id}/`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setMessages(response.data);
    } catch (err) {
      setError('Failed to fetch messages');
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedUser) return;

    try {
      const token = localStorage.getItem('access');
      await axios.post(
        'http://localhost:8000/api/mama/chat/send/',
        {
          recipient_id: selectedUser.id,
          content: message
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setMessage('');
      fetchMessages();
    } catch (err) {
      setError('Failed to send message');
    }
  };

  return (
    <div className="admin-chat-container">
      <button 
        className="chat-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FaComments />
      </button>

      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <h3>{selectedUser ? `Chat with ${selectedUser.username}` : 'Select Provider'}</h3>
            <button onClick={() => setIsOpen(false)}><FaTimes /></button>
          </div>

          {!selectedUser ? (
            <div className="providers-list">
              {providers.map(provider => (
                <div 
                  key={provider.id} 
                  className="provider-item"
                  onClick={() => setSelectedUser(provider)}
                >
                  {provider.profile_photo_url && (
                    <img 
                      src={provider.profile_photo_url} 
                      alt={provider.username} 
                      className="provider-avatar"
                    />
                  )}
                  <div className="provider-info">
                    <span className="provider-name">{provider.username}</span>
                    <span className="provider-email">{provider.email}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="chat-messages">
                {messages.map(msg => (
                  <div 
                    key={msg.id}
                    className={`message ${msg.sender_id === selectedUser.id ? 'received' : 'sent'}`}
                  >
                    <p>{msg.content}</p>
                    <span className="message-time">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={sendMessage} className="chat-input">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                />
                <button type="submit">Send</button>
              </form>
            </>
          )}
        </div>
      )}

      {error && <div className="chat-error">{error}</div>}
    </div>
  );
};

export default AdminChat;
