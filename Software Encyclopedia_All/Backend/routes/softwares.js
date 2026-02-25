
// const express = require("express");
// const router = express.Router();
// const { db } = require("../firebaseAdmin");

// // ➕ ADD
// router.post("/", async (req, res) => {
//   await db.collection("Softwares").add({
//     ...req.body,
//     createdAt: new Date(),
//   });
//   res.send({ success: true });
// });

// // 📥 GET ALL
// router.get("/", async (req, res) => {
//   try {
//     const snap = await db.collection("Softwares").get(); // exact name in Firestore
//     const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
//     console.log("Softwares data:", data);
//     res.json(data);
//   } catch (err) {
//     console.error("Get Softwares Error:", err);
//     res.status(500).json({ error: err.message });
//   }
// });



// // ✏ UPDATE
// router.put("/:id", async (req, res) => {
//   await db.collection("Softwares").doc(req.params.id).update(req.body);
//   res.send({ success: true });
// });

// // ❌ DELETE SOFTWARE + ITS REVIEWS (ONLY DELETE ROUTE)
// router.delete("/:id", async (req, res) => {
//   try {
//     const softwareId = req.params.id;

//     const softwareRef = db.collection("Softwares").doc(softwareId);
//     const softwareSnap = await softwareRef.get();

//     if (!softwareSnap.exists) {
//       return res.status(404).send({ error: "Software not found" });
//     }

//     const { SoftwareName } = softwareSnap.data();

//     // delete related reviews
//     const reviewsSnap = await db
//       .collection("Ratings")
//       .where("softwareName", "==", SoftwareName)
//       .get();

//     const batch = db.batch();

//     reviewsSnap.docs.forEach((doc) => {
//       batch.delete(doc.ref);
//     });

//     // delete software
//     batch.delete(softwareRef);

//     await batch.commit();

//     res.send({
//       success: true,
//       deletedReviews: reviewsSnap.size,
//     });
//   } catch (err) {
//     console.error("Delete software error:", err);
//     res.status(500).send({ error: "Failed to delete software" });
//   }
// });



// module.exports = router;

const express = require("express");
const router = express.Router();
const { db } = require("../firebaseAdmin");

// ➕ ADD SOFTWARE
router.post("/", async (req, res) => {
  try {
    const { SoftwareName, CategoryID, LogoUrl } = req.body;
    if (!SoftwareName || !CategoryID) {
      return res.status(400).json({ success: false, message: "SoftwareName and CategoryID are required" });
    }

    await db.collection("Softwares").add({
      SoftwareName,
      CategoryID,
      LogoUrl: LogoUrl || "",
      createdAt: new Date(),
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Add Software Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 📥 GET ALL SOFTWARES
router.get("/", async (req, res) => {
  try {
    const snap = await db.collection("Softwares").get();
    const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    console.log("Softwares fetched:", data);
    res.json(data);
  } catch (error) {
    console.error("Get Softwares Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✏ UPDATE SOFTWARE
router.put("/:id", async (req, res) => {
  try {
    const softwareId = req.params.id;
    const updateData = req.body;

    if (!updateData || Object.keys(updateData).length === 0) {
      return res.status(400).json({ success: false, message: "No data provided for update" });
    }

    await db.collection("Softwares").doc(softwareId).update(updateData);
    res.json({ success: true });
  } catch (error) {
    console.error("Update Software Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ❌ DELETE SOFTWARE + RELATED REVIEWS
router.delete("/:id", async (req, res) => {
  try {
    const softwareId = req.params.id;
    const softwareRef = db.collection("Softwares").doc(softwareId);
    const softwareSnap = await softwareRef.get();

    if (!softwareSnap.exists) {
      return res.status(404).json({ error: "Software not found" });
    }

    const { SoftwareName } = softwareSnap.data();
    if (!SoftwareName) {
      return res.status(400).json({ error: "SoftwareName missing, cannot delete reviews" });
    }

    // Delete related reviews
    const reviewsSnap = await db.collection("Ratings").where("softwareName", "==", SoftwareName).get();
    const batch = db.batch();

    reviewsSnap.docs.forEach((doc) => batch.delete(doc.ref));
    batch.delete(softwareRef);

    await batch.commit();

    res.json({ success: true, deletedReviews: reviewsSnap.size });
  } catch (error) {
    console.error("Delete Software Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;