import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { useAuth } from './AuthContext';
import './ProviderMessages.css';

const ProviderMessages = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatUsers, setChatUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);
  const [error, setError] = useState(null);
  const [showUsersList, setShowUsersList] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (!token) {
      setError('Authentication token not found');
      return;
    }

    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/mama/chat/users/`, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (Array.isArray(response.data)) {
          setChatUsers(response.data);
          setError(null);
        }
      } catch (err) {
        if (err.response?.status === 401) {
          setError('Session expired. Please login again.');
          // Optional: Redirect to login
          // window.location.href = '/login';
        } else {
          console.error('Error fetching chat users:', err);
          setError('Failed to load users');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchChatHistory = async (userId) => {
    if (!userId) return;

    try {
      setLoading(true);
      
      const token = localStorage.getItem('access');
      console.log('Fetching chat history for user:', userId);

      const response = await axios.get(
        `${API_BASE_URL}/api/mama/chat/history/${userId}/`,
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (Array.isArray(response.data)) {
        console.log('Received messages:', response.data);
        setMessages(response.data);
        scrollToBottom();
      } else {
        console.error('Invalid message format:', response.data);
        setError('Invalid message format from server');
      }
    } catch (err) {
      console.error('Error fetching chat history:', err.response?.data || err);
      setError('Failed to load chat history');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    try {
      const token = localStorage.getItem('access');
      const response = await axios.post(
        `${API_BASE_URL}/api/mama/chat/send/`,
        {
          content: newMessage.trim(),
          recipient_id: selectedChat
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data) {
        const updatedMessages = [...messages, response.data];
        setMessages(updatedMessages);
        setNewMessage('');
        scrollToBottom();
        const fetchData = async () => {
          try {
            const response = await axios.get(`${API_BASE_URL}/api/mama/chat/users/`, {
              headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });
            
            if (Array.isArray(response.data)) {
              setChatUsers(response.data);
              setError(null);
            }
          } catch (err) {
            if (err.response?.status === 401) {
              setError('Session expired. Please login again.');
            } else {
              console.error('Error fetching chat users:', err);
              setError('Failed to load users');
            }
          } finally {
            setLoading(false);
          }
        };
        fetchData();
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (selectedChat) {
      fetchChatHistory(selectedChat);
    }
  }, [selectedChat]);

  const handleUserSelect = (user) => {
    setSelectedChat(user.id);
    setShowUsersList(false);
    fetchChatHistory(user.id);
  };

  const filteredUsers = chatUsers.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`provider-messages-container ${isCollapsed ? 'collapsed' : ''}`}>
      <button className="close-chat-btn" onClick={() => setIsCollapsed(true)}>×</button>
      <div className="collapse-button" onClick={() => setIsCollapsed(!isCollapsed)}>
        {isCollapsed ? '↗' : '↙'}
      </div>
      <div className={`messages-layout ${!showUsersList ? 'expanded' : ''}`}>
        <div className={`users-panel ${!showUsersList ? 'collapsed' : ''}`}>
          <div className="users-header">
            <h3>Available Patients</h3>
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search patients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="close-users-list" onClick={() => setShowUsersList(false)}>×</button>
          </div>
          <div className="users-list">
            {chatUsers.length > 0 ? (
              filteredUsers.map(user => (
                <div
                  key={user.id}
                  className={`user-item ${selectedChat === user.id ? 'active' : ''}`}
                  onClick={() => handleUserSelect(user)}
                >
                  <div className="user-avatar">
                    <img
                      src={user.profile_photo_url || '/default-avatar.png'}
                      alt={user.username}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/default-avatar.png';
                      }}
                    />
                  </div>
                  <div className="user-info">
                    <span className="user-name">{user.username}</span>
                    <span className="user-email">{user.email}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-users">No patients available</div>
            )}
          </div>
        </div>

        <div className="chat-panel">
          {selectedChat ? (
            <>
              <div className="chat-header">
                <div className="chat-header-info">
                  <button 
                    className="back-button"
                    onClick={() => {
                      setSelectedChat(null);
                      setShowUsersList(true);
                    }}
                  >
                    ←
                  </button>
                  <div className="selected-user-info">
                    {chatUsers.find(u => u.id === selectedChat) && (
                      <>
                        <div className="user-avatar">
                          <img
                            src={chatUsers.find(u => u.id === selectedChat).profile_photo_url || '/default-avatar.png'}
                            alt={chatUsers.find(u => u.id === selectedChat).username}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/default-avatar.png';
                            }}
                          />
                        </div>
                        <div className="user-details">
                          <h3>{chatUsers.find(u => u.id === selectedChat).username}</h3>
                          <span className="user-email">
                            {chatUsers.find(u => u.id === selectedChat).email}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="messages-container">
                <div className="chat-messages">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`message ${msg.sender_id === user?.id ? 'sent' : 'received'}`}
                    >
                      <div className="message-bubble">
                        <p>{msg.content}</p>
                        <span className="message-time">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>
              <div className="chat-input">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                />
                <button 
                  onClick={sendMessage} 
                  disabled={!newMessage.trim()}
                >
                  Send
                </button>
              </div>
            </>
          ) : (
            <div className="no-chat-selected">
              <button 
                className="collapse-welcome-btn" 
                onClick={() => setIsCollapsed(true)}
              >
                ×
              </button>
              <h3>Select a patient to start chatting</h3>
            </div>
          )}
        </div>
      </div>
      {error && (
        <div className="error-message" onClick={() => setError(null)}>
          {error}
        </div>
      )}
    </div>
  );
};

export default ProviderMessages;
