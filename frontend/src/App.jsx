import { useState } from "react";
import axios from "axios";
import "./App.css"; // if you have styling

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userText = input; // store input before clearing

    const userMessage = {
      role: "user",
      text: userText,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/chat",
        {
          sessionId: "frontend-session",
          message: userText,
        }
      );

      const botMessage = {
        role: "assistant",
        text: response.data.reply,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Backend Error:", error);
      alert("Error connecting to backend");
    }

    setLoading(false);
  };

  return (
    <div className="container">
      <div className="chat-box">
        <h2>AI Support Assistant</h2>

        <div className="messages">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${
                msg.role === "user" ? "user" : "assistant"
              }`}
            >
              {msg.text}
            </div>
          ))}

          {loading && (
            <div className="message assistant typing">
              Typing...
            </div>
          )}
        </div>

        <div className="input-area">
          <input
            type="text"
            placeholder="Ask your question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;