import React, { useState, useEffect } from "react";
import useWebSocket from "react-use-websocket";
import { useTranslation } from 'react-i18next';
import "./Messages.css"; // Import your styles

const SOCKET_URL = "ws://127.0.0.1:8000/ws/chat/"; // WebSocket URL

const Messages = () => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  // Establish WebSocket connection
  const { sendMessage, lastMessage } = useWebSocket(SOCKET_URL, {
    onOpen: () => console.log("Connected to WebSocket"),
    onClose: () => console.log("Disconnected from WebSocket"),
    onError: (error) => console.error("WebSocket error:", error),
  });

  useEffect(() => {
    if (lastMessage !== null) {
      const newMessage = JSON.parse(lastMessage.data);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    }
  }, [lastMessage]);

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      sendMessage(JSON.stringify({ sender: "Provider", text: message }));
      setMessage(""); // Clear input field
    }
  };

  return (
    <div className="provider-messages-container">
      <h2>{t('messages.title')}</h2>
      <div className="message-box">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender === "Provider" ? "sent" : "received"}`}>
            <p>{msg.text}</p>
          </div>
        ))}
      </div>
      <div className="message-input">
        <input
          type="text"
          placeholder={t('messages.placeholder')}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={handleSendMessage}>{t('messages.send')}</button>
      </div>
    </div>
  );
};

export default Messages;
