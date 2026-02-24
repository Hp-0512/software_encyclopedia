import "../CSS/NewsRowCard.css";
import defaultImage from "../assets/Latest-tech-news3.jpg";

const NewsRowCard = ({ article }) => {
  return (
    <div className="news-row-card">
      <div className="news-row-image">
        <img
          src={article.image || defaultImage}
          alt={article.title}
          onError={(e) => {
            e.target.src = defaultImage;
          }}
        />
      </div>

      <div className="news-row-content">
        <h3>{article.title}</h3>
        <p>{article.description}</p>

        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="read-more"
        >
          Read Full News →
        </a>
      </div>
    </div>
  );
};

export default NewsRowCard;
