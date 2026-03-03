import React, { useEffect, useState } from "react";
import axios from "axios";
import "../CSS/ReviewsList.css";

const ReviewsList = ({ softwareName }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!softwareName) return;

    setLoading(true);

    axios
      .get(
        "http://https://software-encyclopedia-2.onrender.com/api/reviewslist",
        {
          params: { softwareName },
        },
      )
      .then((res) => setReviews(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [softwareName]);

  if (loading) {
    return <p className="reviews-loading">Loading reviews…</p>;
  }

  if (reviews.length === 0) {
    return <p className="reviews-empty">No reviews yet 🌱</p>;
  }

  return (
    <div className="reviews-mini-list">
      {reviews.map((r, i) => (
        <div key={i} className="mini-review-card">
          <div className="mini-stars">
            {"★".repeat(r.rating)}
            {"☆".repeat(5 - r.rating)}
          </div>

          <p className="mini-review-text">“{r.review}”</p>
        </div>
      ))}
    </div>
  );
};

export default ReviewsList;
