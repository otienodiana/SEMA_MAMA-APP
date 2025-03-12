import React, { useState } from "react";

const PatientMessages = () => {
  const [messages, setMessages] = useState([
    { id: 1, sender: "Jane Doe", text: "Hello, I need advice on postpartum recovery." },
    { id: 2, sender: "Mary W.", text: "Can you help me schedule a consultation?" },
  ]);

  const [selectedMessage, setSelectedMessage] = useState(null);
  const [reply, setReply] = useState("");

  const handleSelectMessage = (message) => {
    setSelectedMessage(message);
    setReply("");
  };

  const handleSendReply = () => {
    if (reply.trim()) {
      alert(`Reply sent: ${reply}`);
      setReply("");
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Patient Messages</h2>
      <div className="grid grid-cols-3 gap-4">
        {/* Messages List */}
        <div className="col-span-1 border-r pr-4">
          <h3 className="font-medium mb-2">Inbox</h3>
          <ul>
            {messages.map((msg) => (
              <li
                key={msg.id}
                className={`p-2 border-b cursor-pointer ${
                  selectedMessage?.id === msg.id ? "bg-gray-200" : ""
                }`}
                onClick={() => handleSelectMessage(msg)}
              >
                <strong>{msg.sender}</strong>: {msg.text.slice(0, 20)}...
              </li>
            ))}
          </ul>
        </div>

        {/* Chat Window */}
        <div className="col-span-2">
          {selectedMessage ? (
            <>
              <h3 className="font-medium mb-2">Chat with {selectedMessage.sender}</h3>
              <div className="p-4 border rounded bg-gray-100 mb-2">
                <p className="mb-2"><strong>{selectedMessage.sender}:</strong> {selectedMessage.text}</p>
              </div>
              <textarea
                className="w-full p-2 border rounded mb-2"
                rows="3"
                placeholder="Type your reply..."
                value={reply}
                onChange={(e) => setReply(e.target.value)}
              />
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleSendReply}
              >
                Send Reply
              </button>
            </>
          ) : (
            <p>Select a message to view the conversation.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientMessages;
