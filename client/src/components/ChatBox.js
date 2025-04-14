import React, { useState } from 'react';
import { sendMessage } from '../api';
import './ChatBox.css';

export default function ChatBox({ selectedBook }) {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');

  const handleSend = async () => {
    if (!selectedBook || !message) return;
    try {
      const res = await sendMessage(selectedBook, message);
      setResponse(res.data.response);
    } catch (err) {
      console.error(err);
      setResponse('❌ Failed to get response. Please try again.');
    }
  };

  return (
    <div className="chat-container" dir="rtl">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="מה תרצה לשאול?"
      />
      <button onClick={handleSend}>Send</button>
  
      {response && (
        <div className="response-box">
          <strong>Response:</strong>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
  
}
