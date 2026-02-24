import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "../CSS/AIChatbot.css";

export default function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [softwares, setSoftwares] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [typing, setTyping] = useState(false);

  const messagesEndRef = useRef(null);

  const welcomeMessage = {
    sender: "bot",
    text: "Hi 👋 Welcome to Software Encyclopedia! Ask me about any software 😊",
  };

  const [messages, setMessages] = useState([welcomeMessage]);

  // Fetch softwares
  useEffect(() => {
    axios
      .get("https://software-encyclopedia-1.onrender.com/api/softwares")
      .then((res) => setSoftwares(res.data || []))
      .catch((err) => console.log("Software fetch error:", err));
  }, []);

  // Fetch reviews
  useEffect(() => {
    axios
      .get("https://software-encyclopedia-1.onrender.com/api/reviews")
      .then((res) => setReviews(res.data || []))
      .catch((err) => console.log("Review fetch error:", err));
  }, []);

  // Reset chat when opened
  useEffect(() => {
    if (open) {
      setMessages([welcomeMessage]);
    }
  }, [open]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const sendMessage = async () => {
    if (!input.trim() || typing) return;

    const userText = input;
    setInput("");

    setMessages((prev) => [...prev, { sender: "user", text: userText }]);

    try {
      setTyping(true);

      const res = await axios.post(
        "https://software-encyclopedia-1.onrender.com/api/ai",
        {
          message: userText,
          softwares: softwares || [],
          reviews: reviews || [],
        },
      );

      setMessages((prev) => [...prev, { sender: "bot", text: res.data.reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "❌ Server error. Please try again." },
      ]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <>
      <button className="chatbot-float-btn" onClick={() => setOpen(!open)}>
        🤖
      </button>

      {open && (
        <div className="chatbot-box">
          <div className="chatbot-header">
            <span>AI Assistant</span>
            <button
              className="chatbot-close-btn"
              onClick={() => setOpen(false)}
            >
              ✖
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`chatbot-msg-row ${
                  msg.sender === "user" ? "user" : "bot"
                }`}
              >
                <div
                  className={`chatbot-msg ${
                    msg.sender === "user" ? "user" : "bot"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {typing && (
              <div className="chatbot-msg-row bot">
                <div className="chatbot-msg bot">Typing...</div>
              </div>
            )}

            <div ref={messagesEndRef}></div>
          </div>

          <div className="chatbot-input-area">
            <input
              className="chatbot-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />

            <button
              className="chatbot-send-btn"
              onClick={sendMessage}
              disabled={typing}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
