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
      axios.get(
        "http://https://software-encyclopedia-2.onrender.com/api/categories",
      ),
      axios.get(
        "http://https://software-encyclopedia-2.onrender.com/api/softwares",
      ),
      axios.get(
        "http://https://software-encyclopedia-2.onrender.com/api/trending",
      ),
    ]).then(([catRes, softRes, trendRes]) => {
      setCategories(catRes.data);
      setSoftwares(softRes.data);
      setTrending(trendRes.data);
    });
  }, []);

  const softwaresByCategory = (categoryId) =>
    softwares.filter(
      (s) =>
        String(s.CategoryID).toLowerCase() === String(categoryId).toLowerCase(),
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
                      <span className="version-badge">
                        {s.Version || "v1.0"}
                      </span>
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
                  <div className="trending-action">View Details →</div>
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
                onClick={() => navigate(`/softwares?category=${cat.id}`)}
              >
                <div className="category-header">
                  <h3>{cat.Name}</h3>
                  <span>{list.length}+ tools</span>
                </div>

                <p className="category-tagline">{cat.Description}</p>

                <div className="category-logos">
                  {list.map((s) => (
                    <img
                      key={s.id}
                      src={s.LogoUrl || "/default.png"}
                      alt={s.SoftwareName}
                    />
                  ))}
                </div>

                <div className="explore-btn">Explore →</div>
              </div>
            );
          })}
        </div>
        <Reviews />
      </div>
      <Footer />
    </>
  );
};

export default Home;
