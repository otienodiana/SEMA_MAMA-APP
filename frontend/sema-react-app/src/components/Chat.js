import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './AuthContext';
import './Chat.css';

const Chat = () => {
  const { recipientId } = useParams(); // Get recipient ID from URL
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(recipientId || '');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (user) {
      fetchProviders();
      if (selectedProvider) {
        // Try to load from localStorage first
        const savedMessages = loadSavedMessages(selectedProvider);
        if (savedMessages.length > 0) {
          setMessages(savedMessages);
          setLoading(false);
        }
        // Then fetch latest messages from server
        fetchChatHistory(selectedProvider);
      }
    }
  }, [user, selectedProvider]);

  useEffect(() => {
    if (selectedProvider && messages.length > 0) {
      saveMessages(selectedProvider, messages);
    }
  }, [messages, selectedProvider]);

  const loadSavedMessages = (providerId) => {
    try {
      const saved = localStorage.getItem(`chat_history_${providerId}`);
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      console.error('Error loading saved messages:', err);
      return [];
    }
  };

  const saveMessages = (providerId, messageList) => {
    try {
      localStorage.setItem(`chat_history_${providerId}`, JSON.stringify(messageList));
    } catch (err) {
      console.error('Error saving messages:', err);
    }
  };

  const fetchProviders = async () => {
    try {
      const token = localStorage.getItem('access');
      console.log('Fetching providers...'); 
      
      const response = await axios.get(
        'http://localhost:8000/api/mama/providers/',
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        }
      );
      
      if (Array.isArray(response.data)) {
        const healthcareProviders = response.data.filter(p => p.role === 'healthcare_provider');
        console.log('Available providers:', healthcareProviders);
        setProviders(healthcareProviders);
      } else {
        console.error('Invalid provider data format:', response.data);
        setProviders([]);
      }
    } catch (err) {
      console.error('Error fetching providers:', err.response?.data || err.message);
      setProviders([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchChatHistory = async (providerId) => {
    try {
      const token = localStorage.getItem('access');
      if (!token) {
        console.error('No access token found');
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `http://localhost:8000/api/mama/chat/history/${providerId}/`,
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        }
      );

      if (response.data && Array.isArray(response.data)) {
        // Merge with existing messages, remove duplicates
        const newMessages = response.data;
        const existingIds = new Set(messages.map(m => m.id));
        const uniqueNewMessages = newMessages.filter(m => !existingIds.has(m.id));
        
        if (uniqueNewMessages.length > 0) {
          const updatedMessages = [...messages, ...uniqueNewMessages].sort(
            (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
          );
          setMessages(updatedMessages);
        }
      }
    } catch (err) {
      console.error('Chat history error:', err);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedProvider) return;

    try {
      const token = localStorage.getItem('access');
      if (!token) {
        console.error('No access token found');
        return;
      }

      setLoading(true);
      
      const response = await axios({
        method: 'post',
        url: 'http://localhost:8000/api/mama/chat/send/',
        data: { 
          content: newMessage.trim(),
          recipient_id: selectedProvider 
        },
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (response.data) {
        const updatedMessages = [...messages, response.data];
        setMessages(updatedMessages);
        saveMessages(selectedProvider, updatedMessages);
        setNewMessage('');
        scrollToBottom();
      }

    } catch (err) {
      console.error('Chat error:', err);
      alert('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading && !providers.length) return <div>Loading...</div>;

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Chat with Healthcare Provider</h2>
        {providers.length > 0 ? (
          <select 
            value={selectedProvider} 
            onChange={(e) => setSelectedProvider(e.target.value)}
            className="provider-select"
          >
            <option value="">Select a Healthcare Provider</option>
            {providers.map(provider => (
              <option key={provider.id} value={provider.id}>
                {`${provider.first_name || ''} ${provider.last_name || ''} ${provider.email ? `(${provider.email})` : ''}`}
              </option>
            ))}
          </select>
        ) : (
          <p className="no-providers-message">
            No healthcare providers available
          </p>
        )}
      </div>

      {selectedProvider ? (
        <>
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
        </>
      ) : (
        <div className="select-provider-message">
          Please select a healthcare provider to start chatting
        </div>
      )}
    </div>
  );
};

export default Chat;
