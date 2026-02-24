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

/* ================= GET quiz (FILTER OPTIONAL) ================= */
router.get("/admin/manageresult", async (req, res) => {
    try {
        const { categoryId } = req.query;

        let query = db.collection("quizResults");

        if (categoryId) {
            query = query.where("categoryId", "==", categoryId);
        }

        const snapshot = await query.get();

        const result = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* ================= DELETE RATING ================= */
router.delete("/admin/managequiz/:id", async (req, res) => {
    try {
        await db.collection("quizResults").doc(req.params.id).delete();

        res.json({
            success: true,
            message: "Result deleted successfully",
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
