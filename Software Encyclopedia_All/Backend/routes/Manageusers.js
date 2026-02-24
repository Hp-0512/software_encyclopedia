const express = require("express");
const router = express.Router();
const { db, admin } = require("../firebaseAdmin");

// GET all users
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("users").get();

    const users = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE user
router.delete("/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    // Delete from Firebase Authentication
    await admin.auth().deleteUser(userId);

    // Delete from Firestore
    await db.collection("users").doc(userId).delete();

    res.status(200).json({
      message: "User deleted from Auth and Firestore",
    });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;