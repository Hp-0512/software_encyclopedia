import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "../CSS/UserProfilePanel.css";

const UserProfilePanel = ({ open, onClose }) => {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const [username, setUsername] = useState("");
  const [savedCount, setSavedCount] = useState(0);
  const [attemptCount, setAttemptCount] = useState(0);
  const [editing, setEditing] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !open) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch user document
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();
          setUsername(data.username || "");
          setNewUsername(data.username || "");
        }

        // Count Saved Softwares
        const savedQuery = query(
          collection(db, "savedCollection"),
          where("userId", "==", user.uid),
        );
        const savedSnap = await getDocs(savedQuery);
        setSavedCount(savedSnap.size);

        // Count Quiz Attempts
        const quizQuery = query(
          collection(db, "quizResults"),
          where("userId", "==", user.uid),
        );
        const quizSnap = await getDocs(quizQuery);
        setAttemptCount(quizSnap.size);
      } catch (error) {
        console.error("Profile fetch error:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, [user, open]);

  const handleSaveUsername = async () => {
    if (!newUsername.trim()) {
      alert("Username cannot be empty");
      return;
    }

    try {
      await updateDoc(doc(db, "users", user.uid), {
        username: newUsername,
      });
      setUsername(newUsername);
      setEditing(false);
    } catch (error) {
      console.error("Update error:", error);
      alert("Error updating profile");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  if (!open) return null;

  return (
    <>
      <div className="profile-overlay" onClick={onClose}></div>

      <div className="profile-panel">
        {loading ? (
          <div className="profile-loading">Loading...</div>
        ) : (
          <>
            <button className="panel-close-x" onClick={onClose}>
              ✕
            </button>

            <div className="profile-hero">
              {/* INDEPENDENT PANEL AVATAR */}
              <div className="panel-avatar-container">
                <div className="panel-profile-circle">
                  {username ? username.charAt(0).toUpperCase() : "U"}
                </div>
              </div>

              {/* USERNAME SECTION */}
              <div className="username-container">
                {editing ? (
                  <div className="edit-mode">
                    <input
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      className="username-input-field"
                      autoFocus
                    />
                    <button
                      className="confirm-save-btn"
                      onClick={handleSaveUsername}
                    >
                      ✔
                    </button>
                  </div>
                ) : (
                  <div className="display-mode">
                    <h3>{username}</h3>
                    <span
                      className="pencil-icon"
                      onClick={() => setEditing(true)}
                    >
                      ✏️
                    </span>
                  </div>
                )}
              </div>

              <p className="user-email-text">{user.email}</p>
              <span className="member-since-text">
                Member since{" "}
                {new Date(user.metadata.creationTime).toDateString()}
              </span>
            </div>

            {/* PERMANENTLY VISIBLE STATS */}
            <div className="profile-stats-grid">
              <div className="stat-card-permanent">
                <p>{savedCount}</p>
                <small>Saved</small>
              </div>

              <div className="stat-card-permanent">
                <p>{attemptCount}</p>
                <small>Quiz Attempts</small>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="panel-buttons-list">
              <button onClick={() => navigate("/collection")}>
                View Collection
              </button>
              <button onClick={() => navigate("/quiz-analytics")}>
                Quiz Performance
              </button>
              <button className="panel-logout-action" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default UserProfilePanel;
