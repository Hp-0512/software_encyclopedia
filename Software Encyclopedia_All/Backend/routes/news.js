const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/tech-news", async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.currentsapi.services/v1/latest-news",
      {
        params: {
          category: "technology",
          language: "en",
          apiKey: process.env.NEWS_API_KEY,
        },
      }
    );

    // Currents API uses "news" instead of "articles"
    res.json({ articles: response.data.news });
  } catch (error) {
    console.error(
      "Currents API error:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

module.exports = router;
