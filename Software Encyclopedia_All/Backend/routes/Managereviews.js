const express = require("express");
const router = express.Router();
const { db } = require("../firebaseAdmin");

/* ================= GET CATEGORIES ================= */
router.get("/categories", async (req, res) => {
    try {
        const snapshot = await db.collection("categories").get();

        const categories = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* ================= GET RATINGS (FILTER OPTIONAL) ================= */
router.get("/admin/managereviews", async (req, res) => {
    try {
        const { categoryId } = req.query;

        let query = db.collection("Ratings");

        if (categoryId) {
            query = query.where("categoryId", "==", categoryId);
        }

        const snapshot = await query.get();

        const ratings = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        res.json(ratings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* ================= DELETE RATING ================= */
router.delete("/admin/managereviews/:id", async (req, res) => {
    try {
        await db.collection("ratings").doc(req.params.id).delete();

        res.json({
            success: true,
            message: "Rating deleted successfully",
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
