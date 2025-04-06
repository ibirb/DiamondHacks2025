// frontend/src/components/ChatBotPage.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import './ChatBotPage.css'; // Import the CSS file

function ChatBotPage() {
  const [prompt, setPrompt] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const userId = 1; // Replace with the actual user ID
  const chatHistoryRef = useRef(null);
  const [isBotTyping, setIsBotTyping] = useState(false);

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();

    const newUserMessage = { role: 'user', content: prompt };
    setChatHistory((prevHistory) => [...prevHistory, newUserMessage]);
    setPrompt('');
    setIsBotTyping(true);

    try {
      const res = await fetch(`http://localhost:3001/api/chat/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log("Full API Response:", data.response); // Print the full response to the console
      const newBotMessage = { role: 'bot', content: data.response };
      setChatHistory((prevHistory) => [...prevHistory, newBotMessage]);
    } catch (error) {
      console.error('Error sending prompt:', error);
      const newErrorMessage = { role: 'bot', content: 'Error generating response.' };
      setChatHistory((prevHistory) => [...prevHistory, newErrorMessage]);
    } finally {
      setIsBotTyping(false);
    }
  }, [userId]);

  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [chatHistory]);

  return (
    <div className="chat-bot-container">
      <h1>Chat Bot Page</h1>

      <div className="chat-history" ref={chatHistoryRef}>
        {chatHistory.map((message, index) => (
          <div key={index} className={`chat-message ${message.role}-message`}>
            <strong>{message.role === 'user' ? 'You' : 'Bot'}:</strong>{' '}
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        ))}
        {isBotTyping && (
          <div className="chat-message bot-message">
            <strong>Bot:</strong> Typing...
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="chat-form">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt"
          className="chat-input"
        />
        <button type="submit" className="chat-button" disabled={isBotTyping}>
          Send
        </button>
      </form>
    </div>
  );
}

export default ChatBotPage;
