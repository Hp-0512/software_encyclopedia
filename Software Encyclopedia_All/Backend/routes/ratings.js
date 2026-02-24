// routes/ratings.js
const express = require("express");
const router = express.Router();
const { db } = require("../firebaseAdmin");

// ⭐ Get average rating for a software
router.get("/average", async (req, res) => {
  try {
    const { softwareName } = req.query;
    if (!softwareName) return res.status(400).send([]);

    const snap = await db
      .collection("Ratings")
      .where("softwareName", "==", softwareName)
      .get();

    if (snap.empty) {
      return res.send({ avg: 0, count: 0 });
    }

    let total = 0;
    snap.forEach((d) => (total += d.data().rating));

    res.send({
      avg: (total / snap.size).toFixed(1),
      count: snap.size,
    });
  } catch (err) {
    res.status(500).send({ error: "Failed to get average" });
  }
});

module.exports = router;
