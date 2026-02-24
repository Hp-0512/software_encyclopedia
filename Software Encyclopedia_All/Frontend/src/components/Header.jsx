// // import React from "react";
// // import { useNavigate } from "react-router-dom";
// // import { signOut } from "firebase/auth";
// // import { auth } from "../firebase";

// // import brandLogo from "../assets/only logo.png";
// // import brandName from "../assets/only name.png";
// // import "../CSS/Header.css";

// // const Header = () => {
// //   const navigate = useNavigate();

// //   const handleLogout = async () => {
// //     await signOut(auth);
// //     navigate("/");
// //   };

// //   return (
// //     <header className="main-header">
// //       <div className="header-left">
// //         <img src={brandLogo} alt="logo" className="header-logo" />
// //         <img src={brandName} alt="name" className="header-name" />
// //       </div>

// //       <nav className="header-nav">
// //         <span onClick={() => navigate("/home")}>Home</span>
// //         <span onClick={() => navigate("/contact")}>Contact Us</span>
// //         <span className="logout" onClick={handleLogout}>Logout</span>
// //       </nav>
// //     </header>
// //   );
// // };

// // export default Header;


// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { signOut } from "firebase/auth";
// import { auth } from "../firebase";

// import brandLogo from "../assets/only logo.png";
// import brandName from "../assets/only name.png";
// import defaultAvatar from "../assets/default.png";

// import "../CSS/Header.css";

// const Header = () => {
//   const navigate = useNavigate();
//   const [open, setOpen] = useState(false);

//   const handleLogout = async () => {
//     await signOut(auth);
//     navigate("/");
//   };

//   return (
//     <header className="main-header">
//       {/* LEFT: LOGO */}
//       <div className="logo-area">
//         <img src={brandLogo} className="header-logo" alt="logo" />
//         <img src={brandName} className="header-name" alt="name" />
//       </div>

//       {/* CENTER: MENU */}
//       <nav className="menu">
//         <span onClick={() => navigate("/home")}>Home</span>
//         <span onClick={() => navigate("/softwares")}>Softwares</span>
//         <span onClick={() => navigate("/contact")}>Contact</span>
//       </nav>

//       {/* RIGHT: SEARCH + PROFILE */}
//       <div className="header-actions">
//         <div className="header-search">
//   🔍
//   <input placeholder="Search software..." />
// </div>


//         <div className="profile-wrapper">
//           <img
//             src={defaultAvatar}
//             className="profile-avatar"
//             alt="profile"
//             onClick={() => setOpen(!open)}
//           />

//           {open && (
//             <div className="profile-dropdown">
//               <p className="email">user@email.com</p>
//               <span onClick={() => navigate("/settings")}>Settings</span>
//               <span className="logout" onClick={handleLogout}>
//                 Logout
//               </span>
//             </div>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;


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
        where("userId", "==", user.uid)
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
      <span
        className="quiz-link"
        onClick={() => navigate("/quiz")}
      >
        🧠 Quiz
      </span>

      <span onClick={() => navigate("/community")}>Community</span>


      <span onClick={()=>navigate("/tech-news")}>Tech News</span>

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
