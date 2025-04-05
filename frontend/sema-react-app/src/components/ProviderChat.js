import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import './ProviderChat.css';

const ProviderChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
      const interval = setInterval(fetchUsers, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
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

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('access');
      console.log('Fetching users...'); 
      
      const response = await axios.get(`${API_BASE_URL}/api/users/list/moms/`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Users API response:', response.data);
      
      if (Array.isArray(response.data)) {
        const processedUsers = response.data.map(user => ({
          ...user,
          profile_photo_url: user.profile_photo_url || '/default-avatar.png'
        }));
        setUsers(processedUsers);
        console.log('Processed users:', processedUsers);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to fetch users');
    }
  };

  const fetchMessages = async () => {
    if (!selectedUser) return;

    try {
      const token = localStorage.getItem('access');
      const response = await axios.get(
        `${API_BASE_URL}/api/mama/chat/history/${selectedUser.id}/`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setMessages(response.data);
    } catch (err) {
      setError('Failed to fetch messages');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    try {
      const token = localStorage.getItem('access');
      await axios.post(
        `${API_BASE_URL}/api/mama/chat/send/`,
        {
          recipient_id: selectedUser.id,
          content: newMessage
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Add message to local state
      setMessages(prev => [...prev, {
        content: newMessage,
        sender_id: 'provider', // You'll need to get actual provider ID
        timestamp: new Date().toISOString()
      }]);
      setNewMessage('');

      // Fetch updated messages
      fetchMessages();
    } catch (err) {
      setError('Failed to send message');
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedUser(null); 
    setMessages([]);
    setError(null);
  };

  const closeChat = (e) => {
    e.stopPropagation();
    handleClose();
  };

  const handleUserSelect = (user) => {
    console.log('Selected user:', user);
    setSelectedUser(user);
    setMessages([]); // Clear previous messages
    // Fetch messages immediately after selecting user
    if (user) {
      fetchMessages();
    }
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="provider-chat-container">
      <button className="chat-toggle-btn" onClick={() => setIsOpen(!isOpen)}>
        Chat {users.length > 0 && `(${users.length})`}
      </button>

      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <h3>{selectedUser ? `Chat with ${selectedUser.username}` : 'Select User'}</h3>
            <div className="header-actions">
              {selectedUser && (
                <button onClick={() => setSelectedUser(null)}>Back</button>
              )}
              <button onClick={closeChat}>Close</button>
            </div>
          </div>

          <div className="chat-content">
            {!selectedUser && (
              <div className="users-section">
                {error && <div className="error-message">{error}</div>}
                <div className="search-bar">
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="users-list">
                  {users.length > 0 ? (
                    filteredUsers.map(user => (
                      <div
                        key={user.id}
                        className={`user-item ${selectedUser?.id === user.id ? 'active' : ''}`}
                        onClick={() => handleUserSelect(user)}
                      >
                        <div className="user-avatar">
                          {user.profile_photo_url ? (
                            <img
                              src={user.profile_photo_url}
                              alt={user.username}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/default-avatar.png';
                              }}
                            />
                          ) : (
                            <div className="avatar-placeholder">
                              {user.username[0].toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="user-info">
                          <span className="user-name">{user.username}</span>
                          <span className="user-email">{user.email}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="loading-message">Loading users...</div>
                  )}
                </div>
              </div>
            )}
            
            {selectedUser && (
              <>
                <div className="chat-messages">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`message ${msg.sender_id === 'provider' ? 'sent' : 'received'}`}
                    >
                      <p>{msg.content}</p>
                      <span className="message-time">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSendMessage} className="chat-input">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                  />
                  <button type="submit">Send</button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {error && <div className="chat-error">{error}</div>}
    </div>
  );
};

export default ProviderChat;