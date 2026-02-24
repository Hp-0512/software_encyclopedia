import React, { useState } from "react";
import "../CSS/Feedback.css";
import Header from "../components/Header";

const feedbackTypes = [
  { id: "bug", label: "Bug 🐞" },
  { id: "feature", label: "Feature 🚀" },
  { id: "ui", label: "UI / UX 🎨" },
  { id: "performance", label: "Performance ⚡" },
  { id: "general", label: "General 💬" },
];

const Feedback = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(0);
  const [type, setType] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !rating || !type || !message.trim()) {
      alert("Please fill all required fields ⭐");
      return;
    }

    try {
      const response = await fetch(
        "https://formspree.io/f/xykwqoqr", // ⬅️ REPLACE with YOUR Formspree URL
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            rating,
            feedback_type: type,
            message,
          }),
        },
      );

      if (!response.ok) throw new Error("Failed");

      setSubmitted(true);
      setName("");
      setEmail("");
      setRating(0);
      setType("");
      setMessage("");

      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      setError("Failed to send feedback 😢");
    }
  };

  return (
    <>
      <Header />
      <div className="feedback-page">
        <div className="feedback-hero">
          <h1>We’d love your feedback </h1>
          <p>Help us improve Software Encyclopedia for everyone</p>
        </div>

        <form className="feedback-card" onSubmit={handleSubmit}>
          {submitted && (
            <div className="feedback-success">
              🙌 Feedback sent successfully!
            </div>
          )}

          {error && <div className="feedback-error">{error}</div>}

          <div className="feedback-section">
            <label>Your Name *</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="feedback-section">
            <label>Your Email *</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="feedback-section">
            <label>Overall Experience *</label>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={star <= rating ? "star active" : "star"}
                  onClick={() => setRating(star)}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          <div className="feedback-section">
            <label>Feedback Type *</label>
            <div className="feedback-types">
              {feedbackTypes.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  className={type === item.id ? "type-btn active" : "type-btn"}
                  onClick={() => setType(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="feedback-section">
            <label>Your Feedback *</label>
            <textarea
              placeholder="Tell us what worked, what didn’t, or what you'd love to see next..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={500}
            />
            <div className="char-count">{message.length}/500</div>
          </div>

          <button className="submit-btn" type="submit">
            Submit Feedback
          </button>
        </form>
      </div>
    </>
  );
};

export default Feedback;
