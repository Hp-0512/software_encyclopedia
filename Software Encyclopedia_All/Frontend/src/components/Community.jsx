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
  doc,
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
      axios.get("https://software-encyclopedia-2.onrender.com/api/categories"),
      axios.get("https://software-encyclopedia-2.onrender.com/api/softwares"),
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

          counts[data.categoryId] = (counts[data.categoryId] || 0) + 1;

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
        String(s.CategoryID).toLowerCase() === String(categoryId).toLowerCase(),
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
      const userData = userDoc.exists() ? userDoc.data() : {};

      await addDoc(collection(db, "groupMembers"), {
        userId: user.uid,
        username: userData.username || "User",
        email: user.email,
        categoryId: category.id,
        categoryName: category.Name,
        joinedAt: new Date(),
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
        where("categoryId", "==", categoryId),
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
                  <span>{memberCounts[cat.id] || 0} Members</span>
                </div>

                {/* BUTTON AREA */}
                {isJoined ? (
                  <div className="joined-container">
                    <span className="joined-badge">✓ Joined</span>

                    <button
                      className="enter-btn"
                      onClick={() => navigate(`/community/${cat.id}`)}
                    >
                      Enter
                    </button>

                    <button
                      className="leave-btn"
                      onClick={() => handleLeave(cat.id)}
                    >
                      Leave
                    </button>
                  </div>
                ) : (
                  <button className="join-btn" onClick={() => handleJoin(cat)}>
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
