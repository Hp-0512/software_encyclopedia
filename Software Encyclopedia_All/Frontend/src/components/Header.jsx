import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore"; // Added doc, getDoc

import brandLogo from "../assets/only logo.png";
import brandName from "../assets/only name.png";
import "../CSS/Header.css";

import UserProfilePanel from "./UserProfilePanel";
import { FaUsers } from "react-icons/fa";

import Trie from "../utils/trie";

const Header = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [savedCount, setSavedCount] = useState(0);
  const [username, setUsername] = useState(""); // New state for username
  const [mobileOpen, setMobileOpen] = useState(false);

  const user = auth.currentUser;

  const [suggestions, setSuggestions] = useState([]);
  const [trie, setTrie] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        // 1. Fetch Username for Initial
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUsername(userSnap.data().username || "");
        }

        // 2. Fetch Saved Count
        const q = query(
          collection(db, "SavedSoftwaresweb"),
          where("userId", "==", user.uid),
        );
        const snap = await getDocs(q);
        setSavedCount(snap.size);
      } catch (error) {
        console.error("Error fetching header data:", error);
      }
    };

    fetchData();
  }, [user]);

  useEffect(() => {
    const loadSoftwares = async () => {
      try {
        const snap = await getDocs(collection(db, "Softwares"));

        const softwareNames = [];

        snap.forEach((doc) => {
          const data = doc.data();

          // ✅ CORRECT FIELD NAME
          if (data.SoftwareName) {
            softwareNames.push(data.SoftwareName);
          }
        });

        const newTrie = new Trie();

        softwareNames.forEach((name) => newTrie.insert(name.toLowerCase()));

        console.log("Inserted words:", softwareNames); // debug

        setTrie(newTrie);
      } catch (error) {
        console.error("Error loading softwares for search:", error);
      }
    };

    loadSoftwares();
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (!trie || value.trim() === "") {
      setSuggestions([]);
      return;
    }

    const results = trie.searchPrefix(value.toLowerCase()).slice(0, 5);
    setSuggestions(results);
    console.log("Trie state:", trie);
    console.log("Searching:", value);
  };

  return (
    <>
      <header className="main-header">
        <div className="hamburger" onClick={() => setMobileOpen(!mobileOpen)}>
          ☰
        </div>
        <div className="logo-area" onClick={() => navigate("/home")}>
          <img src={brandLogo} className="header-logo" alt="logo" />
          <img src={brandName} className="header-name" alt="name" />
        </div>

        <nav className={`menu ${mobileOpen ? "active" : ""}`}>
          <span onClick={() => navigate("/home")}>🏠 Home</span>
          <span onClick={() => navigate("/softwares")}>💻 Softwares</span>
          <span
            className="top-rated-link"
            onClick={() => navigate("/softwares?topRated=true")}
          >
            ⭐ Top Rated
          </span>
          <span onClick={() => navigate("/community")}>
            <FaUsers className="community-icon" /> Community
          </span>
          <div className="menu-dropdown">
            <span className="dropdown-title">🎯 Activities</span>

            <div className="dropdown-menu">
              <span onClick={() => navigate("/quiz")}>🧠 Quiz</span>
              <span onClick={() => navigate("/tech-news")}>📰 Tech News</span>
              <span onClick={() => navigate("/feedback")}>💬 Feedback</span>
            </div>
          </div>
          <span onClick={() => navigate("/aboutus")}>ℹ️ About Us</span>
        </nav>

        <div className="header-actions">
          <div className="header-search">
            🔍
            {/* <input
              placeholder="Search software..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearch}
            /> */}
            <input
              placeholder="Search software..."
              value={search}
              onChange={handleSearchChange}
            />
            {suggestions.length > 0 && (
              <div className="search-suggestions">
                {suggestions.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => navigate(`/softwares?search=${item}`)}
                  >
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* PROFILE AVATAR WITH INITIAL */}
          <div className="profile-wrapper">
            <div className="avatar-border" onClick={() => setOpen(true)}>
              <div className="profile-initial">
                {username ? username.charAt(0).toUpperCase() : "U"}
              </div>
            </div>
          </div>
        </div>
      </header>
      {mobileOpen && (
        <div className="mobile-overlay" onClick={() => setMobileOpen(false)} />
      )}
      <UserProfilePanel open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default Header;
