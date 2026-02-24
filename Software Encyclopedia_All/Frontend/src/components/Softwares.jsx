import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import Header from "./Header";
import ReviewsList from "./ReviewsList";
import RatingModal from "./RatingModal";
import "../CSS/Softwares.css";
import {
  collection,
  addDoc,
  deleteDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

const Softwares = () => {
  const [categories, setCategories] = useState([]);
  const [softwares, setSoftwares] = useState([]);
  const [flippedId, setFlippedId] = useState(null);
  const [rateSoftware, setRateSoftware] = useState(null);
  const [showReviewsFor, setShowReviewsFor] = useState(null);
  const [avgRatings, setAvgRatings] = useState({});
  const [savedMap, setSavedMap] = useState({});

  const [loading, setLoading] = useState(true);
  const [ratingsLoading, setRatingsLoading] = useState(true);

  const [params] = useSearchParams();
  const categoryParam = params.get("category");
  const searchParam = params.get("search");
  const topRatedParam = params.get("topRated");

  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    setLoading(true);
    Promise.all([
      axios.get("http://software-encyclopedia-1.onrender.com/api/categories"),
      axios.get("http://software-encyclopedia-1.onrender.com/api/softwares"),
    ])
      .then(([catRes, softRes]) => {
        setCategories(catRes.data);
        setSoftwares(softRes.data);
      })
      .finally(() => setLoading(false));
  }, []);

  /* ---------------- FETCH AVG RATINGS ---------------- */
  useEffect(() => {
    if (!softwares.length) return;

    setRatingsLoading(true);

    Promise.all(
      softwares.map((s) =>
        axios.get(
          "http://software-encyclopedia-1.onrender.com/api/ratings/average",
          {
            params: { softwareName: s.SoftwareName },
          },
        ),
      ),
    ).then((responses) => {
      const map = {};
      responses.forEach((res, index) => {
        map[softwares[index].SoftwareName] = res.data;
      });
      setAvgRatings(map);
      setRatingsLoading(false);
    });
  }, [softwares]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setSavedMap({});
        return;
      }

      const now = new Date();

      const q = query(
        collection(db, "savedCollection"),
        where("userId", "==", user.uid),
      );

      const snapshot = await getDocs(q);
      const map = {};

      for (const docSnap of snapshot.docs) {
        const data = docSnap.data();

        if (data.expiresAt?.toDate() < now) {
          await deleteDoc(docSnap.ref);
        } else {
          map[data.softwareId.id] = true;
        }
      }

      setSavedMap(map);
    });

    return () => unsubscribe();
  }, []);

  /* ---------------- LOAD SAVED STATUS (LOCAL) ---------------- */
  // useEffect(() => {
  //   const user = auth.currentUser;
  //   if (!user) return;

  //   const saved = getValidSaved(user.uid);
  //   const map = {};
  //   saved.forEach((s) => (map[s.softwareId] = true));
  //   setSavedMap(map);
  // }, [softwares]);

  /* ---------------- LOAD SAVED STATUS (FIRESTORE) ---------------- */
  /* ---------------- LOAD SAVED STATUS (FIRESTORE + AUTO 15 DAY CLEANUP) ---------------- */

  /* ---------------- SAVE SOFTWARE (LOCAL) ---------------- */
  const saveSoftware = async (software) => {
    const user = auth.currentUser;
    if (!user) {
      alert("Login required");
      return;
    }

    if (savedMap[software.id]) return;

    const savedAt = new Date();
    const expiresAt = new Date();
    expiresAt.setDate(savedAt.getDate() + 15);

    try {
      await addDoc(collection(db, "savedCollection"), {
        userId: user.uid,
        softwareId: {
          id: software.id,
          SoftwareName: software.SoftwareName,
          CategoryID: software.CategoryID,
          CategoryName: software.CategoryName,
          Description: software.Description,
          DownloadLink: software.DownloadLink,
          LogoUrl: software.LogoUrl,
          OfficialWebsite: software.OfficialWebsite,
          ShortDescription: software.ShortDescription,
          Version: software.Version,
        },
        savedAt,
        expiresAt,
      });

      // instant UI update
      setSavedMap((prev) => ({
        ...prev,
        [software.id]: true,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  /* ---------------- FILTER ---------------- */
  const filteredSoftwares = softwares.filter((s) => {
    if (topRatedParam === "true") {
      return avgRatings[s.SoftwareName]?.avg >= 4;
    }

    if (categoryParam) return String(s.CategoryID) === String(categoryParam);

    if (searchParam)
      return s.SoftwareName.toLowerCase().includes(searchParam.toLowerCase());

    return true;
  });

  /* ---------------- RENDER CATEGORY ---------------- */
  const renderRow = (category) => {
    const list = filteredSoftwares.filter(
      (s) => String(s.CategoryID) === String(category.id),
    );

    if (!list.length) return null;

    return (
      <div key={category.id} className="category-section">
        <h3 className="category-title">{category.Name}</h3>
        <p>{category.Description}</p>

        <div className="software-row">
          {list.map((s) => {
            const flipped = flippedId === s.id;
            const ratingData = avgRatings[s.SoftwareName];
            const isSaved = savedMap[s.id];

            return (
              <div className="flip-card" key={s.id}>
                <div className={`flip-inner ${flipped ? "flipped" : ""}`}>
                  {/* FRONT */}
                  <div className="software-card flip-front">
                    <div className="software-top">
                      <img
                        src={s.LogoUrl || "/default.png"}
                        alt={s.SoftwareName}
                        className="software-logo"
                      />

                      <div style={{ flex: 1 }}>
                        <h4>{s.SoftwareName}</h4>

                        <div className="version-rating-row">
                          <span className="version-badge">{s.Version}</span>

                          {ratingData?.count > 0 && (
                            <span className="avg-rating-inline">
                              ⭐ {ratingData.avg}
                              <span className="rating-count">
                                ({ratingData.count})
                              </span>
                            </span>
                          )}

                          <span
                            title={isSaved ? "Saved" : "Save"}
                            onClick={() => saveSoftware(s)}
                            style={{
                              marginLeft: "auto",
                              cursor: isSaved ? "default" : "pointer",
                              opacity: isSaved ? 0.6 : 1,
                            }}
                          >
                            {isSaved ? "🔖" : "📁"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="software-desc">{s.ShortDescription}</p>

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

                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          className="details-btn"
                          onClick={() => setFlippedId(s.id)}
                        >
                          View more
                        </button>

                        <button
                          className="details-btn"
                          onClick={() => setRateSoftware(s)}
                        >
                          ⭐ Rate
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* BACK */}
                  <div className="software-card flip-back">
                    <h4>{s.SoftwareName}</h4>

                    <div className="long-desc">
                      {showReviewsFor === s.id ? (
                        <ReviewsList softwareName={s.SoftwareName} />
                      ) : (
                        s.Description
                      )}
                    </div>

                    <div
                      style={{ display: "flex", gap: "8px", marginTop: "auto" }}
                    >
                      {showReviewsFor !== s.id && (
                        <button
                          className="details-btn"
                          onClick={() => setShowReviewsFor(s.id)}
                        >
                          💬 View reviews
                        </button>
                      )}

                      <button
                        className="details-btn"
                        onClick={() => {
                          setFlippedId(null);
                          setShowReviewsFor(null);
                        }}
                      >
                        View less
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  /* ---------------- MAIN ---------------- */
  return (
    <>
      <Header />

      <div className="software-page">
        {(loading || ratingsLoading) && (
          <div className="loader">
            <span className="spinner"></span>
            <p>Loading softwares...</p>
          </div>
        )}

        {!loading &&
          !ratingsLoading &&
          searchParam &&
          filteredSoftwares.length === 0 && (
            <div className="no-results">
              <h3>😕 No software found</h3>
              <p>Try a different name</p>
            </div>
          )}

        {!loading && !ratingsLoading && categories.map(renderRow)}
      </div>

      {rateSoftware && (
        <RatingModal
          software={rateSoftware}
          onClose={() => setRateSoftware(null)}
        />
      )}
    </>
  );
};

export default Softwares;
