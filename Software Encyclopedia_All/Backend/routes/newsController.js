import { fetchTechNews } from "../services/currentsService.js";

let cachedNews = [];
let lastFetch = 0;
const CACHE_TIME = 5 * 60 * 1000; // 5 minutes

export const getTechNews = async (req, res) => {
  try {
    const now = Date.now();

    if (cachedNews.length && now - lastFetch < CACHE_TIME) {
      return res.json(cachedNews);
    }

    const news = await fetchTechNews();
    cachedNews = news;
    lastFetch = now;

    res.json(news);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch tech news" });
  }
};
