const express = require("express");
const router = express.Router();
const { db } = require("./firebaseAdmin");

router.get("/", async (req, res) => {
  try {
    const snapshot = await db
      .collection("Ratings")
      .get();

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
    res.status(500).send({ error: "Failed to fetch reviews" });
  }
});

module.exports = router;
