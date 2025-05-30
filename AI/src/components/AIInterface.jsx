// AIInterface.jsx — versión simplificada sin animaciones ni estado de sistema
import React, { useState } from "react";
import "./AIInterface.css";

const AIInterface = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    setMessages([...messages, { from: "user", text }]);
    // Aquí iría la lógica para enviar al asistente de IA
    setInput("");
  };

  return (
    <div className="ai-interface">
      <header className="ai-header">
        <h1 className="terminal-title">AI Messenger</h1>
      </header>

      <div className="messages-container">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.from}`}>
            <div className="message-content">{msg.text}</div>
          </div>
        ))}
      </div>

      <div className="input-section">
        <div className="input-container">
          <textarea
            className="terminal-input"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <button
            className="execute-button"
            onClick={handleSend}
            disabled={!input.trim()}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIInterface;
