import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

import brandLogo from "../assets/only logo.png";
import brandName from "../assets/only name.png";
import defaultAvatar from "../assets/default.png";
import "../CSS/Header.css";

import UserProfilePanel from "./UserProfilePanel";

const Header = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [savedCount, setSavedCount] = useState(0);

  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const fetchCount = async () => {
      const q = query(
        collection(db, "SavedSoftwaresweb"),
        where("userId", "==", user.uid),
      );
      const snap = await getDocs(q);
      setSavedCount(snap.size);
    };

    fetchCount();
  }, [user]);

  const handleSearch = (e) => {
    if (e.key === "Enter" && search.trim()) {
      navigate(`/softwares?search=${search}`);
      //setSearch("");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <header className="main-header">
      <div className="logo-area" onClick={() => navigate("/home")}>
        <img src={brandLogo} className="header-logo" />
        <img src={brandName} className="header-name" />
      </div>

      <nav className="menu">
        <span onClick={() => navigate("/home")}>Home</span>

        <span onClick={() => navigate("/softwares")}>Softwares</span>

        <span onClick={() => navigate("/collection")}>
          Collection {savedCount > 0 && <b>({savedCount})</b>}
        </span>

        <span
          className="top-rated-link"
          onClick={() => navigate("/softwares?topRated=true")}
        >
          ⭐ Top Rated
        </span>

        {/* 🔥 NEW QUIZ SECTION */}
        <span className="quiz-link" onClick={() => navigate("/quiz")}>
          🧠 Quiz
        </span>

        <span onClick={() => navigate("/community")}>Community</span>

        <span onClick={() => navigate("/tech-news")}>Tech News</span>

        <span onClick={() => navigate("/contact")}>Contact</span>
        <span onClick={() => navigate("/feedback")}>Feedback</span>
      </nav>

      <div className="header-actions">
        <div className="header-search">
          🔍
          <input
            placeholder="Search software..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>

        <div className="profile-wrapper">
          <img
            src={defaultAvatar}
            className="profile-avatar"
            onClick={() => setOpen(true)}
          />

          {open && (
            <div className="profile-dropdown">
              <UserProfilePanel open={open} onClose={() => setOpen(false)} />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
