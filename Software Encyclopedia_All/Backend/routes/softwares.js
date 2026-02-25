
const express = require("express");
const router = express.Router();
const { db } = require("../firebaseAdmin");

// ➕ ADD
router.post("/", async (req, res) => {
  await db.collection("Softwares").add({
    ...req.body,
    createdAt: new Date(),
  });
  res.send({ success: true });
});

// 📥 GET ALL
router.get("/", async (req, res) => {
  console.log("Fetching al software");
  const snap = await db.collection("Softwares").get();
  res.send(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  console.log("Software data", data);

});



// ✏ UPDATE
router.put("/:id", async (req, res) => {
  await db.collection("Softwares").doc(req.params.id).update(req.body);
  res.send({ success: true });
});

// ❌ DELETE SOFTWARE + ITS REVIEWS (ONLY DELETE ROUTE)
router.delete("/:id", async (req, res) => {
  try {
    const softwareId = req.params.id;

    const softwareRef = db.collection("Softwares").doc(softwareId);
    const softwareSnap = await softwareRef.get();

    if (!softwareSnap.exists) {
      return res.status(404).send({ error: "Software not found" });
    }

    const { SoftwareName } = softwareSnap.data();

    // delete related reviews
    const reviewsSnap = await db
      .collection("Ratings")
      .where("softwareName", "==", SoftwareName)
      .get();

    const batch = db.batch();

    reviewsSnap.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    // delete software
    batch.delete(softwareRef);

    await batch.commit();

    res.send({
      success: true,
      deletedReviews: reviewsSnap.size,
    });
  } catch (err) {
    console.error("Delete software error:", err);
    res.status(500).send({ error: "Failed to delete software" });
  }
});



module.exports = router;
