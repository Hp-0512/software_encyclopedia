const express = require("express");
const router = express.Router();
const { db } = require("../firebaseAdmin");

router.get("/", async (req, res) => {
  try {
    // 1️⃣ Get all softwares
    const softwareSnap = await db.collection("Softwares").get();
    const softwares = softwareSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    // 2️⃣ Get all ratings
    const ratingsSnap = await db.collection("Ratings").get();
    const ratings = ratingsSnap.docs.map(doc => doc.data());

    // 3️⃣ Get all saved items
    const savedSnap = await db.collection("savedCollection").get();
    const savedItems = savedSnap.docs.map(doc => doc.data());

    // 4️⃣ Build rating map
    const ratingMap = {};
    ratings.forEach(r => {
      if (!ratingMap[r.softwareName]) {
        ratingMap[r.softwareName] = { total: 0, count: 0 };
      }
      ratingMap[r.softwareName].total += r.rating;
      ratingMap[r.softwareName].count += 1;
    });

    // 5️⃣ Build save map
    const saveMap = {};
    savedItems.forEach(s => {
      const name = s.softwareId?.SoftwareName;
      if (!name) return;
      saveMap[name] = (saveMap[name] || 0) + 1;
    });

    // 6️⃣ Calculate trending score
    const trending = softwares.map(software => {
      const ratingData = ratingMap[software.SoftwareName] || { total: 0, count: 0 };
      const avgRating = ratingData.count > 0
        ? ratingData.total / ratingData.count
        : 0;

      const saveCount = saveMap[software.SoftwareName] || 0;
      const reviewCount = ratingData.count;

      const trendingScore =
        (avgRating * 5) +
        (saveCount * 3) +
        (reviewCount * 2);

      return {
        ...software,
        avgRating: avgRating.toFixed(1),
        saveCount,
        reviewCount,
        trendingScore,
      };
    });

    // 7️⃣ Sort descending
    trending.sort((a, b) => b.trendingScore - a.trendingScore);

    // 8️⃣ Return top 6
    res.send(trending.slice(0, 6));

  } catch (err) {
    console.error("Trending error:", err);
    res.status(500).send({ error: "Failed to fetch trending" });
  }
});

module.exports = router;