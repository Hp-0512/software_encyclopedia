// routes/adminprofile.js
const express = require("express");
const router = express.Router();
const { db } = require("../firebaseAdmin"); // your firebase admin config

router.get("/", async (req, res) => {
    try {
        const snapshot = await db.collection("admin").limit(1).get();

        if (snapshot.empty) {
            return res.status(404).json({ message: "Admin not found" });
        }

        const adminDoc = snapshot.docs[0];
        res.status(200).json(adminDoc.data());

    } catch (error) {
        console.error("Error fetching admin profile:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;