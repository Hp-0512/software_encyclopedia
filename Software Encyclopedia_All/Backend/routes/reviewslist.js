const express = require("express");
const router = express.Router();
const { db } = require("../firebaseAdmin");

/**
 * GET /api/reviews?softwareName=Figma
 */
router.get("/", async (req, res) => {
  try {
    const { softwareName } = req.query;

    let query = db.collection("Ratings");

    if (softwareName) {
      // 🔑 FILTER ONLY — NO orderBy
      query = query.where("softwareName", "==", softwareName);
    } else {
      // 🔑 ALL REVIEWS — order by time
      query = query.orderBy("createdAt", "desc");
    }

    const snapshot = await query.get();

    const reviews = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter(
        (r) => r.review && r.review.trim() !== ""
      );

    res.send(reviews);
  } catch (err) {
    console.error("Reviews error:", err);
    res.status(500).send({
      error: "Failed to fetch reviews",
    });
  }
});

module.exports = router;
