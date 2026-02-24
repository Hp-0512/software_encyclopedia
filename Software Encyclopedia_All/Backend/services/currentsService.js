import axios from "axios";

const CURRENTS_URL = "https://api.currentsapi.services/v1/latest-news";

export const fetchTechNews = async () => {
  const response = await axios.get(CURRENTS_URL, {
    params: {
      category: "technology",
      language: "en",
      apiKey: process.env.NEWS_API_KEY,
    },
  });

  return response.data.news;
};
