import React, { useState } from "react";
// import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";

import { db } from "../firebase";
import { auth } from "../firebase";
import "../CSS/RatingModal.css";

const RatingModal = ({ software, onClose }) => {
  const [rating, setRating] = useState(4);
  const [review, setReview] = useState("");

  const submitRating = async () => {
    if (!rating) return;

    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    let email = "";
    let username = "";

    if (userSnap.exists()) {
      email = userSnap.data().email;
      username = userSnap.data().username;
    }

    await addDoc(collection(db, "Ratings"), {
      softwareId: software.id,
      categoryId: software.CategoryID,
      email: user.email,
      username: username,
      softwareName: software.SoftwareName,
      softwareLogo: software.LogoUrl,
      softwareDesc: software.ShortDescription,
      rating,
      review,
      createdAt: serverTimestamp(),
    });

    onClose();
  };

  return (
    <div className="rating-overlay">
      <div className="rating-modal">
        <img src={software.LogoUrl} alt="" className="rating-logo" />
        <h3>{software.SoftwareName}</h3>
        <p className="rating-desc">{software.ShortDescription}</p>

        <div className="stars">
          {[1, 2, 3, 4, 5].map((s) => (
            <span
              key={s}
              className={s <= rating ? "star active" : "star"}
              onClick={() => setRating(s)}
            >
              ★
            </span>
          ))}
        </div>

        <textarea
          placeholder="Write a review..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />

        <div className="rating-actions">
          <button onClick={submitRating}>Submit</button>
          <button className="cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;
