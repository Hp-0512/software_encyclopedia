import { useEffect, useState } from "react";
import NewsRowCard from "./NewsRowCard";
import Header from "./Header";

const TechNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(
          "https://software-encyclopedia-2.onrender.com/api/news/tech-news",
        );
        const data = await res.json();
        setNews(data.articles || []);
      } catch (err) {
        console.error("Error loading news", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) return <p>Loading latest tech news...</p>;

  return (
    <>
      <Header />
      <div className="news-container">
        <h2>Latest Technology & IT News</h2>

        {news.length === 0 && <p>No news available</p>}

        {news.map((article) => (
          <NewsRowCard key={article.id} article={article} />
        ))}
        {/* <div className="imgstyle" style={{ height:"250px", width:"300px", alignContent:"center", alignItems:"initial"}}>
        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Recusandae ullam ducimus, consectetur vero architecto voluptatum exercitationem pariatur minima, nostrum, saepe magnam impedit sunt earum? Tempora perspiciatis repellendus ex aut suscipit?</p>
      </div> */}
      </div>
    </>
  );
};

export default TechNews;
