const express = require("express");
const router = express.Router();
const { db } = require("../firebaseAdmin");

// ➕ ADD CATEGORY
router.post("/", async (req, res) => {
  try {
    const { Name, Description } = req.body;
    if (!Name || !Description) {
      return res.status(400).json({ success: false, message: "Name and Description are required" });
    }

    await db.collection("Categories").add({
      Name,
      Description,
      createdAt: new Date(),
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Add Category Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 📥 GET ALL CATEGORIES
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("Categories").get(); // exact name
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    console.log("Categories fetched:", data);
    res.json(data);
  } catch (error) {
    console.error("Get Categories Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✏ UPDATE CATEGORY
router.put("/:id", async (req, res) => {
  try {
    const { Name, Description } = req.body;
    if (!Name || !Description) {
      return res.status(400).json({ success: false, message: "Name and Description are required" });
    }

    const categoryId = req.params.id;
    await db.collection("Categories").doc(categoryId).update({
      Name,
      Description,
      updatedAt: new Date(),
    });

    res.json({ success: true, message: "Category updated successfully" });
  } catch (error) {
    console.error("Update Category Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ❌ DELETE CATEGORY + RELATED SOFTWARES
router.delete("/:id", async (req, res) => {
  try {
    const categoryId = req.params.id;

    // Delete all softwares in this category
    const softwareSnap = await db.collection("Softwares").where("CategoryID", "==", categoryId).get();
    const batch = db.batch();
    softwareSnap.docs.forEach((doc) => batch.delete(doc.ref));

    // Delete the category itself
    batch.delete(db.collection("Categories").doc(categoryId));

    await batch.commit();

    res.json({ success: true, deletedSoftwares: softwareSnap.size });
  } catch (error) {
    console.error("Delete Category Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;