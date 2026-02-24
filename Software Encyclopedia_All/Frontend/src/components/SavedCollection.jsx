// // // import React, { useEffect, useState } from "react";
// // // import Header from "./Header";
// // // import { auth } from "../firebase";
// // // import "../CSS/Softwares.css";

// // // /* ================= STORAGE HELPERS ================= */
// // // const getStorageKey = (uid) => `saved_softwares_${uid}`;

// // // const getValidSavedSoftwares = (uid) => {
// // //   const raw = localStorage.getItem(getStorageKey(uid));
// // //   if (!raw) return [];

// // //   const now = Date.now();
// // //   const parsed = JSON.parse(raw);
// // //   const valid = parsed.filter(item => item.expiresAt > now);

// // //   localStorage.setItem(getStorageKey(uid), JSON.stringify(valid));
// // //   return valid;
// // // };
// // // /* =================================================== */

// // // const SavedCollection = () => {
// // //   const [softwares, setSoftwares] = useState([]);
// // //   const user = auth.currentUser;

// // //   useEffect(() => {
// // //     if (!user) return;
// // //     setSoftwares(getValidSavedSoftwares(user.uid));
// // //   }, [user]);

// // //   const remove = (softwareId) => {
// // //     const updated = softwares.filter(s => s.softwareId !== softwareId);
// // //     setSoftwares(updated);
// // //     localStorage.setItem(
// // //       getStorageKey(user.uid),
// // //       JSON.stringify(updated)
// // //     );
// // //   };

// // //   return (
// // //     <>
// // //       <Header />

// // //       <div className="software-page">
// // //         <div className="category-section">
// // //           <h3 className="category-title">Your Collection</h3>

// // //           <div className="software-row">
// // //             {softwares.map((s) => (
// // //               <div className="flip-card" key={s.softwareId}>
// // //                 <div className="flip-inner">
// // //                   <div className="software-card flip-front">
// // //                     <div className="software-top">
// // //                       <img src={s.LogoUrl} className="software-logo" alt={s.SoftwareName} />
// // //                       <div>
// // //                         <h4>{s.SoftwareName}</h4>
// // //                         <span className="version-badge">{s.Version}</span>
// // //                       </div>
// // //                     </div>

// // //                     <p className="software-desc">{s.ShortDescription}</p>

// // //                     <div className="software-actions">
// // //                       <div className="primary-actions">
// // //                         <a href={s.DownloadLink} className="download-btn" target="_blank" rel="noreferrer">
// // //                           ⬇ Download
// // //                         </a>
// // //                         <a href={s.OfficialWebsite} className="website-btn" target="_blank" rel="noreferrer">
// // //                           🔗 Website
// // //                         </a>
// // //                       </div>

// // //                       <button className="details-btn" onClick={() => remove(s.softwareId)}>
// // //                         ❌ Remove
// // //                       </button>
// // //                     </div>
// // //                   </div>
// // //                 </div>
// // //               </div>
// // //             ))}

// // //             {softwares.length === 0 && (
// // //               <p style={{ opacity: 0.6 }}>No saved software yet</p>
// // //             )}
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </>
// // //   );
// // // };

// // // export default SavedCollection;


// // import React, { useEffect, useState } from "react";
// // import axios from "axios";
// // import Header from "./Header";
// // import { auth } from "../firebase";
// // import {
// //   collection,
// //   getDocs,
// //   query,
// //   where,
// //   deleteDoc,
// //   doc,
// // } from "firebase/firestore";
// // import { db } from "../firebase";
// // import "../CSS/Softwares.css";

// // const SavedCollection = () => {
// //   const [softwares, setSoftwares] = useState([]);

// //   useEffect(() => {
// //     const fetchSaved = async () => {
// //       const user = auth.currentUser;
// //       if (!user) return;

// //       const q = query(
// //         collection(db, "savedSoftwares"),
// //         where("userId", "==", user.uid)
// //       );

// //       const snapshot = await getDocs(q);
// //       const savedDocs = snapshot.docs;

// //       const savedIds = savedDocs.map((d) => d.data().softwareId);

// //       const res = await axios.get("http://localhost:5000/api/softwares");

// //       const savedSoftwares = res.data.filter((s) =>
// //         savedIds.includes(s.id)
// //       );

// //       setSoftwares(savedSoftwares);
// //     };

// //     fetchSaved();
// //   }, []);

// //   const remove = async (softwareId) => {
// //     const user = auth.currentUser;
// //     if (!user) return;

// //     const q = query(
// //       collection(db, "savedSoftwares"),
// //       where("userId", "==", user.uid),
// //       where("softwareId", "==", softwareId)
// //     );

// //     const snapshot = await getDocs(q);

// //     snapshot.forEach(async (d) => {
// //       await deleteDoc(doc(db, "savedSoftwares", d.id));
// //     });

// //     setSoftwares((prev) =>
// //       prev.filter((s) => s.id !== softwareId)
// //     );
// //   };

// //   return (
// //     <>
// //       <Header />

// //       <div className="software-page">
// //         <div className="category-section">
// //           <h3 className="category-title">Your Collection</h3>

// //           <div className="software-row">
// //             {softwares.map((s) => (
// //               <div className="flip-card" key={s.id}>
// //                 <div className="flip-inner">
// //                   <div className="software-card flip-front">
// //                     <div className="software-top">
// //                       <img
// //                         src={s.LogoUrl || "/default.png"}
// //                         alt={s.SoftwareName}
// //                         className="software-logo"
// //                       />
// //                       <div>
// //                         <h4>{s.SoftwareName}</h4>
// //                         <span className="version-badge">{s.Version}</span>
// //                       </div>
// //                     </div>

// //                     <p className="software-desc">
// //                       {s.ShortDescription}
// //                     </p>

// //                     <div className="software-actions">
// //                       <div className="primary-actions">
// //                         <a
// //                           href={s.DownloadLink}
// //                           className="download-btn"
// //                           target="_blank"
// //                           rel="noreferrer"
// //                         >
// //                           ⬇ Download
// //                         </a>
// //                         <a
// //                           href={s.OfficialWebsite}
// //                           className="website-btn"
// //                           target="_blank"
// //                           rel="noreferrer"
// //                         >
// //                           🔗 Website
// //                         </a>
// //                       </div>

// //                       <button
// //                         className="details-btn"
// //                         onClick={() => remove(s.id)}
// //                       >
// //                         ❌ Remove
// //                       </button>
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>
// //             ))}

// //             {softwares.length === 0 && (
// //               <p style={{ opacity: 0.6 }}>
// //                 No saved software yet
// //               </p>
// //             )}
// //           </div>
// //         </div>
// //       </div>
// //     </>
// //   );
// // };

// // export default SavedCollection;


// import React, { useEffect, useState } from "react";
// import Header from "./Header";
// import { auth } from "../firebase";
// import {
//   collection,
//   getDocs,
//   query,
//   where,
//   deleteDoc,
//   doc,
// } from "firebase/firestore";
// import { db } from "../firebase";
// import { onAuthStateChanged } from "firebase/auth";
// import "../CSS/Softwares.css";

// const SavedCollection = () => {
//   const [softwares, setSoftwares] = useState([]);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       if (!user) {
//         setSoftwares([]);
//         return;
//       }

//       try {
//         const q = query(
//           collection(db, "savedCollection"),
//           where("userId", "==", user.uid)
//         );

//         const snapshot = await getDocs(q);
//         const now = new Date();
//         const validSoftwares = [];

//         for (const document of snapshot.docs) {
//           const data = document.data();

//           if (data.expiresAt?.toDate() <= now) {
//             await deleteDoc(doc(db, "savedCollection", document.id));
//           } else {
//             validSoftwares.push({
//               id: document.id,
//               ...data.softwareId,
//             });
//           }
//         }

//         setSoftwares(validSoftwares);
//       } catch (error) {
//         console.error("Error fetching saved softwares:", error);
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   const remove = async (docId) => {
//     await deleteDoc(doc(db, "savedCollection", docId));
//     setSoftwares((prev) => prev.filter((s) => s.id !== docId));
//   };

//   return (
//     <>
//       <Header />
//       <div className="software-page">
//         <div className="category-section">
//           <h3 className="category-title">Your Collection</h3>

//           <div className="software-row">
//             {softwares.map((s) => (
//               <div className="flip-card" key={s.id}>
//                 <div className="flip-inner">
//                   <div className="software-card flip-front">
//                     <div className="software-top">
//                       <img
//                         src={s.LogoUrl || "/default.png"}
//                         alt={s.SoftwareName}
//                         className="software-logo"
//                       />
//                       <div>
//                         <h4>{s.SoftwareName}</h4>
//                         <span className="version-badge">{s.Version}</span>
//                       </div>
//                     </div>

//                     <p className="software-desc">
//                       {s.ShortDescription}
//                     </p>

//                     <div className="software-actions">
//                       <div className="primary-actions">
//                         <a
//                           href={s.DownloadLink}
//                           className="download-btn"
//                           target="_blank"
//                           rel="noreferrer"
//                         >
//                           ⬇ Download
//                         </a>
//                         <a
//                           href={s.OfficialWebsite}
//                           className="website-btn"
//                           target="_blank"
//                           rel="noreferrer"
//                         >
//                           🔗 Website
//                         </a>
//                       </div>

//                       <button
//                         className="details-btn"
//                         onClick={() => remove(s.id)}
//                       >
//                         ❌ Remove
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}

//             {softwares.length === 0 && (
//               <p style={{ opacity: 0.6 }}>No saved software yet</p>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default SavedCollection;

import React, { useEffect, useState } from "react";
import Header from "./Header";
import { auth, db } from "../firebase";
import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import "../CSS/Softwares.css";

const SavedCollection = () => {
  const [softwares, setSoftwares] = useState([]);
  const [confirmId, setConfirmId] = useState(null);
  const [removingId, setRemovingId] = useState(null);
  const [loading, setLoading] = useState(true);


  /* ---------------- FETCH SAVED + AUTO CLEANUP ---------------- */
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (!user) {
      setSoftwares([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const q = query(
        collection(db, "savedCollection"),
        where("userId", "==", user.uid)
      );

      const snapshot = await getDocs(q);
      const now = new Date();
      const validSoftwares = [];

      for (const documentSnap of snapshot.docs) {
        const data = documentSnap.data();

        if (data.expiresAt?.toDate() <= now) {
          await deleteDoc(doc(db, "savedCollection", documentSnap.id));
        } else {
          validSoftwares.push({
          docId: documentSnap.id,
          expiresAt: data.expiresAt.toDate(), // 👈 store expiry date
          ...data.softwareId,
        });
        }
      }

      setSoftwares(validSoftwares);
    } catch (error) {
      console.error("Error fetching saved softwares:", error);
    } finally {
      setLoading(false);   // ✅ stop spinner
    }
  });

  return () => unsubscribe();
}, []);


useEffect(() => {
  const interval = setInterval(() => {
    setSoftwares((prev) => [...prev]);
  }, 60 * 60 * 1000); // update every hour

  return () => clearInterval(interval);
}, []);


const getDaysRemaining = (expiryDate) => {
  const now = new Date();
  const diff = expiryDate - now;

  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return days;
};

  /* ---------------- REMOVE WITH ANIMATION ---------------- */
  const remove = async (docId) => {
    try {
      setRemovingId(docId); // trigger animation

      // Wait for animation (300ms)
      setTimeout(async () => {
        await deleteDoc(doc(db, "savedCollection", docId));

        setSoftwares((prev) =>
          prev.filter((s) => s.docId !== docId)
        );

        setRemovingId(null);
        setConfirmId(null);
      }, 300);
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  return (
    <>
      <Header />

      <div className="software-page">
        <div className="category-section">
          <h3 className="category-title">Your Collection</h3>

          <div className="software-row">
            {softwares.map((s) => (
              <div
                className={`flip-card 
                  ${removingId === s.docId ? "fade-out" : ""}
                  ${getDaysRemaining(s.expiresAt) <= 1 ? "expiring-soon" : ""}
                `}
                key={s.docId}
              >

                <div className="flip-inner">
                  <div className="software-card flip-front">
                    <div className="software-top">
                      <img
                        src={s.LogoUrl || "/default.png"}
                        alt={s.SoftwareName}
                        className="software-logo"
                      />
                      <div>
                        <h4>{s.SoftwareName}</h4>
                        <span className="version-badge">{s.Version}</span>
                        <span
                          className={`expiry-badge ${
                            getDaysRemaining(s.expiresAt) <= 1
                              ? "expiry-danger"
                              : getDaysRemaining(s.expiresAt) <= 3
                              ? "expiry-warning"
                              : ""
                          }`}
                        >
                          {(() => {
                            const days = getDaysRemaining(s.expiresAt);

                            if (days <= 0) return "Expired";
                            if (days === 1) return "Expires tomorrow";
                            if (days === 2) return "Expires in 2 days";
                            if (days <= 3) return `Expires in ${days} days`;

                            return `Expires in ${days} days`;
                          })()}
                        </span>

                      </div>
                    </div>

                    <p className="software-desc">
                      {s.ShortDescription}
                    </p>

                    <div className="software-actions">
                      <div className="primary-actions">
                        <a
                          href={s.DownloadLink}
                          className="download-btn"
                          target="_blank"
                          rel="noreferrer"
                        >
                          ⬇ Download
                        </a>

                        <a
                          href={s.OfficialWebsite}
                          className="website-btn"
                          target="_blank"
                          rel="noreferrer"
                        >
                          🔗 Website
                        </a>
                      </div>

                      <button
                        className="details-btn"
                        onClick={() => setConfirmId(s.docId)}
                      >
                        ❌ Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {loading && (
             <div className="loader">
              <span className="spinner"></span>
              <p>Loading your collection...</p>
            </div>
          )}

          {!loading && softwares.length === 0 && (
            <p style={{ opacity: 0.6 }}>
              No saved software yet
            </p>
          )}

          </div>
        </div>
      </div>

      {/* ---------------- CONFIRMATION MODAL ---------------- */}
      {confirmId && (
        <div className="confirm-overlay">
          <div className="confirm-modal">
            <h4>Remove Software?</h4>
            <p>This will delete it from your saved collection.</p>

            <div className="confirm-actions">
              <button
                className="cancel-btn"
                onClick={() => setConfirmId(null)}
              >
                Cancel
              </button>

              <button
                className="confirm-btn"
                onClick={() => remove(confirmId)}
              >
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SavedCollection;
