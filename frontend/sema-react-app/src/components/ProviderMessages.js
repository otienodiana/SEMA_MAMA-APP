import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import './Chat.css';

const ProviderMessages = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatUsers, setChatUsers] = useState([]);
  const messagesEndRef = useRef(null);
  const [error, setError] = useState(null);

  const loadSavedMessages = (userId) => {
    try {
      const savedMessages = localStorage.getItem(`provider_chat_${user?.id}_${userId}`);
      return savedMessages ? JSON.parse(savedMessages) : [];
    } catch (err) {
      console.error('Error loading saved messages:', err);
      return [];
    }
  };

  const saveMessages = (userId, messageList) => {
    try {
      localStorage.setItem(`provider_chat_${user?.id}_${userId}`, JSON.stringify(messageList));
    } catch (err) {
      console.error('Error saving messages:', err);
    }
  };

  useEffect(() => {
    if (user?.email) {
      console.log('Provider logged in:', user.email);
      fetchChatUsers();
      const interval = setInterval(fetchChatUsers, 10000);
      return () => clearInterval(interval);
    } else {
      console.error('No user email found');
      setError('Not authenticated');
    }
  }, [user]);

  useEffect(() => {
    if (selectedChat) {
      fetchChatHistory(selectedChat);
      const interval = setInterval(() => fetchChatHistory(selectedChat), 5000); // Poll messages every 5 seconds
      return () => clearInterval(interval);
    }
  }, [selectedChat]);

  const fetchChatUsers = async () => {
    try {
      const token = localStorage.getItem('access');
      if (!token) {
        console.error('No access token found');
        setError('Not authenticated');
        return;
      }

      setLoading(true);
      console.log('Fetching chats for provider:', user?.email);
      
      const response = await axios.get(
        'http://localhost:8000/api/mama/chats/users/',
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Chat users response:', response.data);

      if (Array.isArray(response.data)) {
        const sortedUsers = response.data.sort((a, b) => {
          if (b.unread_count !== a.unread_count) {
            return b.unread_count - a.unread_count;
          }
          return new Date(b.last_message_time) - new Date(a.last_message_time);
        });
        setChatUsers(sortedUsers);
        setError(null);
      } else {
        console.error('Invalid response format:', response.data);
        setError('Invalid response format from server');
      }
    } catch (err) {
      console.error('Error fetching chat users:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Failed to load chat users');
      setChatUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchChatHistory = async (userId) => {
    if (!userId) return;

    try {
      setLoading(true);
      
      const savedMessages = loadSavedMessages(userId);
      if (savedMessages.length > 0) {
        setMessages(savedMessages);
        scrollToBottom();
      }

      const token = localStorage.getItem('access');
      console.log('Fetching chat history for user:', userId);

      const response = await axios.get(
        `http://localhost:8000/api/mama/chat/history/${userId}/`,
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
        saveMessages(userId, response.data);
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
        'http://localhost:8000/api/mama/chat/send/',
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
        saveMessages(selectedChat, updatedMessages);
        setNewMessage('');
        scrollToBottom();
        fetchChatUsers();
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="provider-chat-container">
      <div className="chat-users-list">
        <h3>Chat Messages</h3>
        {loading ? (
          <div className="loading">Loading chats...</div>
        ) : chatUsers.length > 0 ? (
          <div className="users-list">
            {chatUsers.map(chatUser => (
              <div
                key={chatUser.id}
                className={`chat-user-item ${selectedChat === chatUser.id ? 'active' : ''}`}
                onClick={() => setSelectedChat(chatUser.id)}
              >
                <div className="user-info">
                  <span className="user-name">
                    {chatUser.first_name} {chatUser.last_name}
                  </span>
                  <span className="user-email">{chatUser.email}</span>
                  {chatUser.last_message && (
                    <span className="last-message">
                      {chatUser.last_message.substring(0, 30)}...
                    </span>
                  )}
                </div>
                {chatUser.unread_count > 0 && (
                  <span className="unread-badge">{chatUser.unread_count}</span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="no-chats">
            {error || "No messages yet"}
          </div>
        )}
      </div>

      <div className="messages-modal">
        <div className="chat-messages-container">
          <div className="modal-header">
            <h3>Messages</h3>
            <button className="cancel-btn" onClick={() => window.history.back()}>
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="messages-list">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${msg.sender_id === user?.id ? 'sent' : 'received'}`}
              >
                {msg.sender_id !== user?.id && (
                  <div className="message-sender">{msg.sender_name}</div>
                )}
                <div className="message-content">{msg.content}</div>
                <div className="message-timestamp">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="message-input">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            />
            <button onClick={sendMessage} disabled={!newMessage.trim()}>
              Send
            </button>
          </div>
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
