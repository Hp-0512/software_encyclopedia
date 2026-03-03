// // import React, { useEffect, useState } from "react";
// // import {
// //   collection,
// //   onSnapshot,
// //   query,
// //   orderBy,
// // } from "firebase/firestore";
// // import { db } from "../firebase";

// // const Home = () => {
// //   const [softwares, setSoftwares] = useState([]);

// //   useEffect(() => {
// //     const q = query(
// //       collection(db, "Softwares"),
// //       orderBy("createdAt", "desc")
// //     );

// //     const unsubscribe = onSnapshot(q, (snapshot) => {
// //       const list = snapshot.docs.map((doc) => ({
// //         id: doc.id,
// //         ...doc.data(),
// //       }));
// //       setSoftwares(list);
// //     });

// //     return () => unsubscribe();
// //   }, []);

// //   return (
// //     <div style={{ padding: "30px", color: "#111" }}>
// //       <h1>Software Encyclopedia</h1>
// //       <p>Explore softwares by category</p>

// //       {softwares.length === 0 ? (
// //         <p>No software available</p>
// //       ) : (
// //         <div style={gridStyle}>
// //           {softwares.map((soft) => (
// //             <div key={soft.id} style={cardStyle}>
// //               <h3>{soft.name}</h3>
// //               <p style={{ color: "#666" }}>
// //                 Category: {soft.categoryName}
// //               </p>
// //             </div>
// //           ))}
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // const gridStyle = {
// //   display: "grid",
// //   gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
// //   gap: "20px",
// //   marginTop: "20px",
// // };

// // const cardStyle = {
// //   border: "1px solid #ddd",
// //   borderRadius: "10px",
// //   padding: "15px",
// //   background: "#fff",
// //   boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
// // };

// // export default Home;


// import React, { useEffect, useState } from "react";
// import Header from "../components/Header";
// import { collection, getDocs } from "firebase/firestore";
// import { db } from "../firebase";

// import "../CSS/Home.css";

// const Home = () => {
//   const [softwareList, setSoftwareList] = useState([]);

//   useEffect(() => {
//     const fetchSoftware = async () => {
//       const snapshot = await getDocs(collection(db, "softwares"));
//       const data = snapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       setSoftwareList(data);
//     };

//     fetchSoftware();
//   }, []);

//   return (
//     <div className="home-page">
//       <Header />

//       <div className="home-content">
//         <h2>Explore Software</h2>

//         <div className="software-grid">
//           {softwareList.length === 0 ? (
//             <p className="empty-text">No software available</p>
//           ) : (
//             softwareList.map((item) => (
//               <div className="software-card" key={item.id}>
//                 <h3>{item.name}</h3>
//                 <p>{item.description}</p>
//                 <span className="category">{item.category}</span>
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;


// import React, { useEffect, useState } from "react";
// import Header from "../components/Header";
// import { collection, getDocs, orderBy, query } from "firebase/firestore";
// import { db } from "../firebase";
// import "../CSS/Home.css";

// const Home = () => {
//   const [softwareList, setSoftwareList] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchSoftware = async () => {
//       try {
//         const q = query(
//           collection(db, "Softwares"), // ✅ EXACT name from Firestore
//           orderBy("createdAt", "desc")
//         );

//         const snapshot = await getDocs(q);

//         const data = snapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));

//         setSoftwareList(data);
//       } catch (error) {
//         console.error("Error fetching software:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSoftware();
//   }, []);

//   return (
//     <>
//       <Header />

//       <div className="home-wrapper">
//         <h2 className="page-title">Explore Software</h2>

//         {loading ? (
//           <p className="empty-text">Loading...</p>
//         ) : softwareList.length === 0 ? (
//           <p className="empty-text">No software available</p>
//         ) : (
//           <div className="software-grid">
//             {softwareList.map((soft) => (
//               <div className="software-card" key={soft.id}>
//                 <h3>{soft.name}</h3>
//                 <p className="category">
//                   {soft.categoryName}
//                 </p>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default Home;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Header from "../components/Header";
// import "../CSS/Home.css";

// const Home = () => {
//   const [categories, setCategories] = useState([]);
//   const [softwares, setSoftwares] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     Promise.all([
//       axios.get("http://localhost:5000/api/categories"),
//       axios.get("http://localhost:5000/api/softwares"),
//     ])
//       .then(([catRes, softRes]) => {
//         setCategories(catRes.data);
//         setSoftwares(softRes.data);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error(err);
//         setLoading(false);
//       });
//   }, []);

//   // group softwares by category
// const getSoftwaresByCategory = (categoryId) =>
//   softwares.filter((s) => {
//     const sid =
//       s.CategoryID || s.CategoryId || s.categoryId || s.categoryID;

//     return (
//       sid &&
//       String(sid).toLowerCase() === String(categoryId).toLowerCase()
//     );
//   });


//   return (
//     <>
//       <Header />

//       <div className="home-wrapper">
//         {loading ? (
//           <p>Loading...</p>
//         ) : (
//           categories.map((cat) => {
//             const categorySoftwares = getSoftwaresByCategory(cat.id);

//             return (
//               <div key={cat.id} className="category-section">
//                 <h3 className="category-title">{cat.Name}</h3>

//                 {categorySoftwares.length === 0 ? (
//                   <p className="empty-text">
//                     No software available in this category
//                   </p>
//                 ) : (
//                   <div className="software-row">
//                     {categorySoftwares.map((s) => (
//                       <div className="software-card" key={s.id}>
//                         <img
//                           src={s.LogoUrl || "/default.png"}
//                           alt={s.SoftwareName}
//                         />

//                         <div className="software-info">
//                           <h4>{s.SoftwareName}</h4>
//                           <p className="version">
//                             Version: {s.Version}
//                           </p>
//                           <p className="desc">
//                             {s.ShortDescription}
//                           </p>
//                         </div>

//                         <div className="actions">
//                           <a
//                             href={s.DownloadLink}
//                             target="_blank"
//                             rel="noreferrer"
//                           >
//                             ⬇
//                           </a>
//                           <a
//                             href={s.OfficialWebsite}
//                             target="_blank"
//                             rel="noreferrer"
//                           >
//                             🔗
//                           </a>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             );
//           })
//         )}
//       </div>
//     </>
//   );
// };

// export default Home;


import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import "../CSS/Home.css";
import Reviews from "./Reviews";
import Footer from "./Footer";

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [softwares, setSoftwares] = useState([]);
  const [trending, setTrending] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:5000/api/categories"),
      axios.get("http://localhost:5000/api/softwares"),
      axios.get("http://localhost:5000/api/trending"),
    ]).then(([catRes, softRes, trendRes]) => {
      setCategories(catRes.data);
      setSoftwares(softRes.data);
      setTrending(trendRes.data);
    });
  }, []);

  const softwaresByCategory = (categoryId) =>
    softwares.filter(
      (s) =>
        String(s.CategoryID).toLowerCase() ===
        String(categoryId).toLowerCase()
    );

  return (
    <>
      <Header />

      <div className="home-wrapper">
        {/* HERO */}
        <div className="home-hero">
          {/* 🔥 TRENDING SECTION */}
        <div className="trending-section">
          <h1>🔥 Trending Now</h1>
          <br></br>
          <div className="trending-grid">
            {trending.slice(0, 5).map((s, index) => (
  <div
    key={s.id}
    className="trending-card"
    onClick={() => navigate(`/software/${s.id}`)}
  >

    {/* Top Section */}
    <div className="trending-top">
      <img src={s.LogoUrl} alt={s.SoftwareName} />
      <div className="trending-info">
        <h4>{s.SoftwareName}</h4>
        <span className="version-badge">{s.Version || "v1.0"}</span>
      </div>
    </div>

    {/* Description */}
    <p className="trending-desc">
      {s.ShortDescription?.slice(0, 80)}...
    </p>

    {/* Stats */}
    <div className="trending-stats">
      <span>⭐ {s.avgRating}</span>
      <span>📝 {s.reviewCount}</span>
      <span>💾 {s.saveCount}</span>
    </div>

    {/* Action */}
    <div className="trending-action">
      View Details →
    </div>
  </div>
))}
          </div>
        </div>
          <h1>Discover Software by Category</h1>
          <p>Curated tools for developers, designers, testers and gamers</p>
        </div>

        

        {/* CATEGORY SHOWCASE */}
        <div className="category-showcase">
          {categories.map((cat) => {
            const list = softwaresByCategory(cat.id).slice(0, 5);

            return (
              <div
                key={cat.id}
                className="category-showcase-card"
                onClick={() =>
                  navigate(`/softwares?category=${cat.id}`)
                }
              >
                <div className="category-header">
                  <h3>{cat.Name}</h3>
                  <span>{list.length}+ tools</span>
                </div>

                <p className="category-tagline">
                  {cat.Description}
                </p>

                <div className="category-logos">
                  {list.map((s) => (
                    <img
                      key={s.id}
                      src={s.LogoUrl || "/default.png"}
                      alt={s.SoftwareName}
                    />
                  ))}
                </div>

                <div className="explore-btn">
                  Explore →
                </div>
              </div>
            );
          })}
        </div>
         <Reviews />
      </div>
      <Footer/>
    </>
  );
};

export default Home;



