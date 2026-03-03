import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "../CSS/AIChatbot.css";
import ReactMarkdown from "react-markdown";

export default function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [softwares, setSoftwares] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [typing, setTyping] = useState(false);

  // New UI States
  const [buttonMode, setButtonMode] = useState("text"); // text → icon
  const [popupMessage, setPopupMessage] = useState("");
  const popupIntervalRef = useRef(null);
  const popupTimeoutRef = useRef(null);

  const messagesEndRef = useRef(null);

  const welcomeMessage = {
    sender: "bot",
    text: "Hi 👋 Welcome to Software Encyclopedia! Ask me about any software 😊",
  };

  const [messages, setMessages] = useState([welcomeMessage]);

  /* ===============================
     BUTTON TRANSITION (TEXT → ICON)
  =============================== */
  useEffect(() => {
    const timer = setTimeout(() => {
      setButtonMode("icon");
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  /* ===============================
     CONTINUOUS POPUP LOOP
  =============================== */
  useEffect(() => {
    const defaultMessages = [
      "Hi 👋",
      "Welcome user 🙏",
      "If there's a problem then let's chat",
      "Ready to help you 😊",
      "Do you want to know about any software 🤔 search here 😊",
      "Ask me anything in my field 🫡 ",
    ];

    let index = 0;

    const startPopupLoop = () => {
      popupIntervalRef.current = setInterval(() => {
        if (!open && buttonMode === "icon") {
          setPopupMessage(defaultMessages[index]);
          index = (index + 1) % defaultMessages.length;

          popupTimeoutRef.current = setTimeout(() => {
            setPopupMessage("");
          }, 2500);
        }
      }, 4000);
    };

    startPopupLoop();

    return () => {
      clearInterval(popupIntervalRef.current);
      clearTimeout(popupTimeoutRef.current);
    };
  }, [open, buttonMode]);

  /* ===============================
     FETCH DATA (UNCHANGED)
  =============================== */
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/softwares")
      .then((res) => setSoftwares(res.data || []))
      .catch((err) => console.log("Software fetch error:", err));
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/reviews")
      .then((res) => setReviews(res.data || []))
      .catch((err) => console.log("Review fetch error:", err));
  }, []);

  useEffect(() => {
    if (open) {
      setMessages([welcomeMessage]);
      setPopupMessage("");
    }
  }, [open]);

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

      const res = await axios.post("http://localhost:5000/api/ai", {
        message: userText,
        softwares: softwares || [],
        reviews: reviews || [],
      });

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
      {/* FLOATING BUTTON */}
      <div
        className={`chatbot-trigger ${buttonMode}`}
        onClick={() => setOpen(!open)}
      >
        {buttonMode === "text" ? (
          <span className="chatbot-text-btn">
            Hi 👋 Need Help?
          </span>
        ) : (
          <span className="chatbot-icon">🤖</span>
        )}
      </div>

      {/* POPUP MESSAGE */}
      {popupMessage && !open && (
        <div className="chatbot-popup">
          {popupMessage}
        </div>
      )}

      {/* CHAT WINDOW */}
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
                <div className={`chatbot-msg ${msg.sender === "user" ? "user" : "bot"}`}>
                  {msg.sender === "bot" ? (
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  ) : (
                    msg.text
                  )}
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