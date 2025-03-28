import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import './Chat.css';

const Chat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (user) {
      fetchChatHistory();
    }
  }, [user]);

  const fetchChatHistory = async () => {
    try {
      const token = localStorage.getItem('access');
      if (!token) {
        console.error('No access token found');
        setLoading(false);
        return;
      }

      const response = await axios.get(
        'http://localhost:8000/api/mama/chat/history/',
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        }
      );

      if (response.data && Array.isArray(response.data)) {
        setMessages(response.data);
      }
    } catch (err) {
      console.error('Chat history error:', err);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const token = localStorage.getItem('access');
      if (!token) {
        console.error('No access token found');
        return;
      }

      setLoading(true); // Add loading state
      
      // Check server availability first
      const response = await axios({
        method: 'post',
        url: 'http://localhost:8000/api/mama/chat/send/',
        data: { content: newMessage.trim() },
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        // Add timeout and retry config
        timeout: 5000,
        retry: 3,
        retryDelay: 1000
      });

      if (response.data) {
        setMessages(prevMessages => [...prevMessages, {
          ...response.data,
          sender_id: user.id
        }]);
        setNewMessage('');
        scrollToBottom();
      }

    } catch (err) {
      // Enhanced error handling
      console.error('Chat error details:', {
        message: err.message,
        code: err.code,
        response: err.response?.data,
        status: err.response?.status
      });
      
      // Show user-friendly error
      alert(
        err.code === 'ECONNREFUSED' 
          ? 'Unable to connect to chat server. Please try again later.'
          : 'Failed to send message. Please try again.'
      );

    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) return <div>Loading chat...</div>;

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Community Chat</h2>
      </div>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.sender_id === user.id ? 'sent' : 'received'}`}
          >
            <div className="message-content">{msg.content}</div>
            <div className="message-timestamp">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="chat-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
