import React, { useEffect, useState } from "react";
import axios from "axios";
import "../CSS/Reviews.css";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    axios
      .get("http://software-encyclopedia-1.onrender.com/api/reviews")
      .then((res) => {
        console.log("REVIEWS API DATA 👉", res.data); // 👈 ADD THIS
        setReviews(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  //if (reviews.length === 0) return null; // 👈 nothing to show

  return (
    <div className="reviews-section">
      <h2>What Our Users Say</h2>
      <p className="reviews-subtitle">
        Real feedback from people using these tools
      </p>

      <div className="reviews-grid">
        {reviews.slice(0, 6).map((r) => (
          <div key={r.id} className="review-card">
            <p className="review-text">“{r.review}”</p>

            <div className="review-footer">
              <img
                src={r.softwareLogo || "/default.png"}
                alt={r.softwareName}
              />

              <div>
                <h4>{r.softwareName}</h4>
                <div className="stars">
                  {"★".repeat(r.rating)}
                  {"☆".repeat(5 - r.rating)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
