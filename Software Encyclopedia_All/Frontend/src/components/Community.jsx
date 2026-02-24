// // import { useEffect, useState } from "react";
// // import axios from "axios";
// // import { auth } from "../firebase";
// // import { useNavigate } from "react-router-dom";
// // import Header from "../components/Header";


// // const API = "http://localhost:5000/api/community";

// // export default function Community() {
// //   const [categories, setCategories] = useState([]);
// //   const [statusMap, setStatusMap] = useState({});
// //   const [loadingMap, setLoadingMap] = useState({});
// //   const navigate = useNavigate();

// //   /* ================= GET CATEGORIES ================= */
// //   useEffect(() => {
// //     const fetchCategories = async () => {
// //       try {
// //         const res = await axios.get(`${API}/categories`);
// //         setCategories(Array.isArray(res.data) ? res.data : []);
// //       } catch (err) {
// //         console.error("Category fetch error:", err);
// //         setCategories([]);
// //       }
// //     };

// //     fetchCategories();
// //   }, []);

// //   /* ================= FETCH STATUS ================= */
// //   useEffect(() => {
// //     const fetchStatuses = async () => {
// //       if (!auth.currentUser || categories.length === 0) return;

// //       const newStatusMap = {};
// //       const newLoadingMap = {};

// //       for (let cat of categories) {
// //         const catId = cat.id;
// //         newLoadingMap[catId] = true;

// //         try {
// //           const res = await axios.get(
// //             `${API}/status/${auth.currentUser.uid}/${catId}`
// //           );

// //           newStatusMap[catId] = res.data.status;
// //         } catch (err) {
// //           console.error("Status fetch error:", err);
// //           newStatusMap[catId] = null;
// //         }

// //         newLoadingMap[catId] = false;
// //       }

// //       setStatusMap(newStatusMap);
// //       setLoadingMap(newLoadingMap);
// //     };

// //     fetchStatuses();
// //   }, [categories]);

// //   /* ================= HANDLE JOIN ================= */
// //   const handleJoin = async (categoryId) => {
// //     try {
// //       await axios.post(`${API}/join`, {
// //         userId: auth.currentUser.uid,
// //         categoryId
// //       });

// //       // Immediately refresh status
// //       const updated = await axios.get(
// //         `${API}/status/${auth.currentUser.uid}/${categoryId}`
// //       );

// //       setStatusMap(prev => ({
// //         ...prev,
// //         [categoryId]: updated.data.status
// //       }));

// //     } catch (error) {
// //       console.error("Join request error:", error);
// //     }
// //   };

// //   /* ================= BUTTON RENDER ================= */
// //   const renderButton = (catId) => {
// //     if (loadingMap[catId]) {
// //       return <button disabled>Checking...</button>;
// //     }

// //     const status = statusMap[catId];

// //     if (status === "approved") {
// //       return (
// //         <button onClick={() => navigate(`/community/${catId}`)}>
// //           Enter Group
// //         </button>
// //       );
// //     }

// //     if (status === "pending") {
// //       return <button disabled>Request Sent</button>;
// //     }

// //     if (status === "rejected") {
// //       return (
// //         <button onClick={() => handleJoin(catId)}>
// //           Request Again
// //         </button>
// //       );
// //     }

// //     return (
// //       <button onClick={() => handleJoin(catId)}>
// //         Request to Join
// //       </button>
// //     );
// //   };

// //   return (
// //     <>
// //     <Header/>
// //     <div style={{ padding: "40px" }}>
// //       <h1>Software Encyclopedia Community</h1>

// //       {categories.length === 0 ? (
// //         <p>No categories found.</p>
// //       ) : (
// //         categories.map(cat => (
// //           <div key={cat.id} style={{ marginBottom: "20px" }}>
// //             <h3>{cat.Name}</h3>
// //             {renderButton(cat.id)}
// //           </div>
// //         ))
// //       )}
// //     </div>
// //     </>
// //   );
// // }



// // import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
// // import { db } from "../firebase";
// // import Header from "../components/Header";

// // const handleJoin = async (category) => {
// //   const user = auth.currentUser;

// //   // Check if already member
// //   const q = query(
// //     collection(db, "groupMembers"),
// //     where("userId", "==", user.uid),
// //     where("categoryId", "==", category.id)
// //   );

// //   const snapshot = await getDocs(q);

// //   if (!snapshot.empty) {
// //     navigate(`/community/${category.id}`);
// //     return;
// //   }

// //   // Add member
// //   await addDoc(collection(db, "groupMembers"), {
// //     userId: user.uid,
// //     username: user.displayName,
// //     email: user.email,
// //     categoryId: category.id,
// //     categoryName: category.Name,
// //     joinedAt: new Date()
// //   });

// //   navigate(`/community/${category.id}`);
// //   return(
// //     <>
// //     <Header/>
// //     <div>
// //       <button onClick={() => handleJoin(cat)}>Join Group</button>
// //     </div>
// //     </>
// //   );
// // };



// // import { useEffect, useState } from "react";
// // import axios from "axios";
// // import { auth } from "../firebase";
// // import { useNavigate } from "react-router-dom";

// // export default function Community() {

// //   const [categories, setCategories] = useState([]);
// //   const navigate = useNavigate();

// //   useEffect(() => {
// //     const fetchCategories = async () => {
// //       const res = await axios.get("http://localhost:5000/api/categories");
// //       setCategories(res.data);
// //     };

// //     fetchCategories();
// //   }, []);

// //   const handleJoin = async (category) => {

// //     await axios.post("http://localhost:5000/api/community/join", {
// //       userId: auth.currentUser.uid,
// //       username: auth.currentUser.displayName,
// //       email: auth.currentUser.email,
// //       categoryId: category.id,
// //       categoryName: category.Name
// //     });

// //     navigate(`/community/${category.id}`);
// //   };

// //   return (
// //     <div style={{ padding: "40px" }}>
// //       <h2>Community Groups</h2>

// //       {categories.map(cat => (
// //         <div key={cat.id} style={{ marginBottom: "20px" }}>
// //           <h3>{cat.Name}</h3>
// //           <button onClick={() => handleJoin(cat)}>
// //             Join Group
// //           </button>
// //         </div>
// //       ))}
// //     </div>
// //   );
// // }


// // import { useEffect, useState } from "react";
// // import axios from "axios";
// // import { auth } from "../firebase";
// // import { useNavigate } from "react-router-dom";
// // import Header from "../components/Header";
// // import "../CSS/Community.css";

// // export default function Community() {

// //   const [categories, setCategories] = useState([]);
// //   const [memberCounts, setMemberCounts] = useState({});
// //   const navigate = useNavigate();

// //   useEffect(() => {
// //     const fetchCategories = async () => {
// //       const res = await axios.get("http://localhost:5000/api/categories");
// //       setCategories(res.data);

// //       // Fetch member count for each category
// //       const counts = {};
// //       for (let cat of res.data) {
// //         const members = await axios.get(
// //           `http://localhost:5000/api/community/members`
// //         );

// //         counts[cat.id] = members.data.filter(
// //           m => m.categoryId === cat.id
// //         ).length;
// //       }

// //       setMemberCounts(counts);
// //     };

// //     fetchCategories();
// //   }, []);

// //   const handleJoin = async (category) => {

// //     await axios.post("http://localhost:5000/api/community/join", {
// //       userId: auth.currentUser.uid,
// //       username: auth.currentUser.displayName,
// //       email: auth.currentUser.email,
// //       categoryId: category.id,
// //       categoryName: category.Name
// //     });

// //     navigate(`/community/${category.id}`);
// //   };

// //   return (
// //     <>
// //       <Header />

// //       <div className="community-page">

// //         <div className="community-header">
// //           <h2>Community Groups</h2>
// //           <p>Connect. Learn. Collaborate with like-minded people.</p>
// //         </div>

// //         <div className="community-grid">
// //           {categories.map(cat => (
// //             <div key={cat.id} className="community-card">

// //               <div className="community-card-content">
// //                 <h3>{cat.Name}</h3>

// //                 <div className="member-count">
// //                   {memberCounts[cat.id] || 0} Members
// //                 </div>
// //               </div>

// //               <button
// //                 className="join-btn"
// //                 onClick={() => handleJoin(cat)}
// //               >
// //                 Join Group
// //               </button>

// //             </div>
// //           ))}
// //         </div>

// //       </div>
// //     </>
// //   );
// // }


// // import { useEffect, useState } from "react";
// // import axios from "axios";
// // import { auth } from "../firebase";
// // import { useNavigate } from "react-router-dom";
// // import Header from "../components/Header";
// // import "../CSS/Community.css";

// // export default function Community() {
// //   const [categories, setCategories] = useState([]);
// //   const [softwares, setSoftwares] = useState([]);
// //   const [memberCounts, setMemberCounts] = useState({});
// //   const navigate = useNavigate();

// //   useEffect(() => {
// //     Promise.all([
// //       axios.get("http://localhost:5000/api/categories"),
// //       axios.get("http://localhost:5000/api/softwares"),
// //       axios.get("http://localhost:5000/api/community/members")
// //     ]).then(([catRes, softRes, memberRes]) => {
// //       setCategories(catRes.data);
// //       setSoftwares(softRes.data);

// //       const counts = {};
// //       memberRes.data.forEach(m => {
// //         counts[m.categoryId] = (counts[m.categoryId] || 0) + 1;
// //       });

// //       setMemberCounts(counts);
// //     });
// //   }, []);

// //   const softwaresByCategory = (categoryId) =>
// //     softwares.filter(
// //       (s) =>
// //         String(s.CategoryID).toLowerCase() ===
// //         String(categoryId).toLowerCase()
// //     );

// //   const handleJoin = async (category) => {
// //     await axios.post("http://localhost:5000/api/community/join", {
// //       userId: auth.currentUser.uid,
// //       username: auth.currentUser.displayName,
// //       email: auth.currentUser.email,
// //       categoryId: category.id,
// //       categoryName: category.Name
// //     });

// //     navigate(`/community/${category.id}`);
// //   };

// //   return (
// //     <>
// //       <Header />

// //       <div className="community-page">

// //         <div className="community-header">
// //           <h2>Community Groups</h2>
// //           <p>Connect. Learn. Collaborate with like‑minded people.</p>
// //         </div>

// //         <div className="community-grid">
// //           {categories.map((cat) => {
// //             const list = softwaresByCategory(cat.id).slice(0, 4);

// //             return (
// //               <div key={cat.id} className="community-card">

// //                 {/* TOP */}
// //                 <div className="card-top">
// //                   <h3>{cat.Name}</h3>

// //                   <div className="logo-stack">
// //                     {list.map((s, index) => (
// //                       <img
// //                         key={s.id}
// //                         src={s.LogoUrl || "/default.png"}
// //                         alt={s.SoftwareName}
// //                         style={{ zIndex: 10 - index }}
// //                       />
// //                     ))}
// //                   </div>
// //                 </div>

// //                 {/* DESCRIPTION */}
// //                 <p className="category-desc">
// //                   {cat.Description || `Join the ${cat.Name} community and explore related tools.`}
// //                 </p>

// //                 {/* META INFO */}
// //                 <div className="card-meta">
// //                   <span>{memberCounts[cat.id] || 0} Members</span>
// //                 </div>

// //                 {/* BUTTON */}
// //                 <button
// //                   className="join-btn"
// //                   onClick={() => handleJoin(cat)}
// //                 >
// //                   Join Group
// //                 </button>

// //               </div>
// //             );
// //           })}
// //         </div>
// //       </div>
// //     </>
// //   );
// // }

// import { useEffect, useState } from "react";
// import axios from "axios";
// import { auth, db } from "../firebase";
// import { useNavigate } from "react-router-dom";
// import Header from "../components/Header";
// import "../CSS/Community.css";

// import {
//   collection,
//   query,
//   where,
//   onSnapshot,
//   addDoc,
//   doc,
//   getDoc,
//   deleteDoc
// } from "firebase/firestore";


// export default function Community() {
//   const [categories, setCategories] = useState([]);
//   const [softwares, setSoftwares] = useState([]);
//   const [memberCounts, setMemberCounts] = useState({});
//   const [joinedGroups, setJoinedGroups] = useState([]);

//   const navigate = useNavigate();

//   /* ================= FETCH DATA ================= */
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [catRes, softRes] = await Promise.all([
//           axios.get("http://localhost:5000/api/categories"),
//           axios.get("http://localhost:5000/api/softwares")
//         ]);

//         setCategories(catRes.data);
//         setSoftwares(softRes.data);

//         // Fetch all group members
//         const membersSnapshot = await getDocs(
//           collection(db, "groupMembers")
//         );

//         const counts = {};
//         const joined = [];

//         membersSnapshot.forEach((docSnap) => {
//           const data = docSnap.data();

//           // Count members per category
//           counts[data.categoryId] =
//             (counts[data.categoryId] || 0) + 1;

//           // Check if current user joined
//           if (data.userId === auth.currentUser?.uid) {
//             joined.push(data.categoryId);
//           }
//         });

//         setMemberCounts(counts);
//         setJoinedGroups(joined);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   /* ================= FILTER SOFTWARES ================= */
//   const softwaresByCategory = (categoryId) =>
//     softwares.filter(
//       (s) =>
//         String(s.CategoryID).toLowerCase() ===
//         String(categoryId).toLowerCase()
//     );

//   /* ================= HANDLE JOIN ================= */
//   const handleJoin = async (category) => {
//     try {
//       const user = auth.currentUser;

//       if (!user) return;

//       // Prevent duplicate join
//       if (joinedGroups.includes(category.id)) {
//         navigate(`/community/${category.id}`);
//         return;
//       }

//       // Get username from users collection
//       const userDoc = await getDoc(doc(db, "users", user.uid));
//       const userData = userDoc.exists()
//         ? userDoc.data()
//         : {};

//       await addDoc(collection(db, "groupMembers"), {
//         userId: user.uid,
//         username: userData.username || "User",
//         email: user.email,
//         categoryId: category.id,
//         categoryName: category.Name,
//         joinedAt: new Date()
//       });

//       // Update UI instantly
//       setJoinedGroups((prev) => [...prev, category.id]);

//       setMemberCounts((prev) => ({
//         ...prev,
//         [category.id]: (prev[category.id] || 0) + 1
//       }));

//       navigate(`/community/${category.id}`);
//     } catch (error) {
//       console.error("Join error:", error);
//     }
//   };

//   /* ================= UI ================= */
//   return (
//     <>
//       <Header />

//       <div className="community-page">
//         <div className="community-header">
//           <h2>Community Groups</h2>
//           <p>Connect. Learn. Collaborate with like‑minded people.</p>
//         </div>

//         <div className="community-grid">
//           {categories.map((cat) => {
//             const list = softwaresByCategory(cat.id).slice(0, 4);
//             const isJoined = joinedGroups.includes(cat.id);

//             return (
//               <div key={cat.id} className="community-card">
//                 {/* TOP */}
//                 <div className="card-top">
//                   <h3>{cat.Name}</h3>

//                   <div className="logo-stack">
//                     {list.map((s, index) => (
//                       <img
//                         key={s.id}
//                         src={s.LogoUrl || "/default.png"}
//                         alt={s.SoftwareName}
//                         style={{ zIndex: 10 - index }}
//                       />
//                     ))}
//                   </div>
//                 </div>

//                 {/* DESCRIPTION */}
//                 <p className="category-desc">
//                   {cat.Description ||
//                     `Join the ${cat.Name} community and explore related tools.`}
//                 </p>

//                 {/* META */}
//                 <div className="card-meta">
//                   <span>
//                     {memberCounts[cat.id] || 0} Members
//                   </span>
//                 </div>

//                 {/* BUTTON */}
//                 {isJoined ? (
//                   <button
//                     className="joined-btn"
//                     onClick={() =>
//                       navigate(`/community/${cat.id}`)
//                     }
//                   >
//                     Enter Group
//                   </button>
//                 ) : (
//                   <button
//                     className="join-btn"
//                     onClick={() => handleJoin(cat)}
//                   >
//                     Join Group
//                   </button>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </>
//   );
// }



import { useEffect, useState } from "react";
import axios from "axios";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "../CSS/Community.css";

import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  getDoc,
  getDocs,
  deleteDoc,
  doc
} from "firebase/firestore";

export default function Community() {
  const [categories, setCategories] = useState([]);
  const [softwares, setSoftwares] = useState([]);
  const [memberCounts, setMemberCounts] = useState({});
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [toast, setToast] = useState("");

  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  /* ================= FETCH CATEGORIES & SOFTWARES ================= */
  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:5000/api/categories"),
      axios.get("http://localhost:5000/api/softwares")
    ]).then(([catRes, softRes]) => {
      setCategories(catRes.data);
      setSoftwares(softRes.data);
    });
  }, []);

  /* ================= REAL-TIME GROUP MEMBERS ================= */
useEffect(() => {
  const unsubscribeAuth = auth.onAuthStateChanged((user) => {
    if (!user) {
      setLoading(false);
      return;
    }

    const q = query(collection(db, "groupMembers"));

    const unsubscribeSnap = onSnapshot(q, (snapshot) => {
      const counts = {};
      const joined = [];

      snapshot.forEach((docSnap) => {
        const data = docSnap.data();

        counts[data.categoryId] =
          (counts[data.categoryId] || 0) + 1;

        if (data.userId === user.uid) {
          joined.push(data.categoryId);
        }
      });

      setMemberCounts(counts);
      setJoinedGroups(joined);
      setLoading(false); // ✅ STOP SPINNER HERE
    });

    return () => unsubscribeSnap();
  });

  return () => unsubscribeAuth();
}, []);

  /* ================= FILTER SOFTWARES ================= */
  const softwaresByCategory = (categoryId) =>
    softwares.filter(
      (s) =>
        String(s.CategoryID).toLowerCase() ===
        String(categoryId).toLowerCase()
    );

  /* ================= JOIN ================= */
  const handleJoin = async (category) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      if (joinedGroups.includes(category.id)) {
        navigate(`/community/${category.id}`);
        return;
      }

      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.exists()
        ? userDoc.data()
        : {};

      await addDoc(collection(db, "groupMembers"), {
        userId: user.uid,
        username: userData.username || "User",
        email: user.email,
        categoryId: category.id,
        categoryName: category.Name,
        joinedAt: new Date()
      });

      setToast("Successfully joined!");
      setTimeout(() => setToast(""), 3000);
    } catch (error) {
      console.error("Join error:", error);
    }
  };

  /* ================= LEAVE ================= */
  const handleLeave = async (categoryId) => {
    try {
      const q = query(
        collection(db, "groupMembers"),
        where("userId", "==", auth.currentUser.uid),
        where("categoryId", "==", categoryId)
      );

      const snapshot = await getDocs(q);

      snapshot.forEach(async (docSnap) => {
        await deleteDoc(doc(db, "groupMembers", docSnap.id));
      });

      setToast("You left the group");
      setTimeout(() => setToast(""), 3000);
    } catch (error) {
      console.error("Leave error:", error);
    }
  };


    if (loading) {
      return (
        <>
          <Header />
          <div className="spinner-center">
            <div className="spinner"></div>
          </div>
        </>
      );
    }

  /* ================= UI ================= */
  return (
    <>
      <Header />

      <div className="community-page">
        <div className="community-header">
          <h2>Community Groups</h2>
          <p>Connect. Learn. Collaborate with like‑minded people.</p>
        </div>

        <div className="community-grid">
          {categories.map((cat) => {
            const list = softwaresByCategory(cat.id).slice(0, 4);
            const isJoined = joinedGroups.includes(cat.id);

            return (
              <div key={cat.id} className="community-card">
                {/* TOP */}
                <div className="card-top">
                  <h3>{cat.Name}</h3>

                  <div className="logo-stack">
                    {list.map((s, index) => (
                      <img
                        key={s.id}
                        src={s.LogoUrl || "/default.png"}
                        alt={s.SoftwareName}
                        style={{ zIndex: 10 - index }}
                      />
                    ))}
                  </div>
                </div>

                {/* DESCRIPTION */}
                <p className="category-desc">
                  {cat.Description ||
                    `Join the ${cat.Name} community and explore related tools.`}
                </p>

                {/* META */}
                <div className="card-meta">
                  <span>
                    {memberCounts[cat.id] || 0} Members
                  </span>
                </div>

                {/* BUTTON AREA */}
                {isJoined ? (
                  <div className="joined-container">
                    <span className="joined-badge">
                      ✓ Joined
                    </span>

                    <button
                      className="enter-btn"
                      onClick={() =>
                        navigate(`/community/${cat.id}`)
                      }
                    >
                      Enter
                    </button>

                    <button
                      className="leave-btn"
                      onClick={() =>
                        handleLeave(cat.id)
                      }
                    >
                      Leave
                    </button>
                  </div>

                ) : (
                  <button
                    className="join-btn"
                    onClick={() => handleJoin(cat)}
                  >
                    Join Group
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* TOAST */}
        {toast && <div className="toast">{toast}</div>}
      </div>
    </>
  );
}

