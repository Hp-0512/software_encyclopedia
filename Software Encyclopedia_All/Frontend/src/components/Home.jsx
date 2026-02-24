import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import "../CSS/Home.css";
import Reviews from "./Reviews";

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [softwares, setSoftwares] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      axios.get("https://software-encyclopedia-1.onrender.com/api/categories"),
      axios.get("https://software-encyclopedia-1.onrender.com/api/softwares"),
    ]).then(([catRes, softRes]) => {
      setCategories(catRes.data);
      setSoftwares(softRes.data);
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
    </>
  );
};

export default Home;
