
const express = require("express");
const router = express.Router();
const { db } = require("../firebaseAdmin");
const { messaging } = require("firebase-admin");

// ➕ Add Category
router.post("/", async (req, res) => {
  const { Name, Description } = req.body;

  if (!Name || !Description) {
    return res.status(400).send({
      success: false,
      message: "Name and Description are required",
    });
  }

  await db.collection("Categories").add({
    Name,
    Description,
    createdAt: new Date(),
  });

  res.send({ success: true });
});

// 📥 Get Categories
router.get("/", async (req, res) => {
  const snapshot = await db.collection("Categories").get();

  const data = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  console.log("Categories data", data);

  res.send(data);
});

// router.get("/", async (req, res) => {
//   try {
//     const snapshot = await db.collection("categories").get();

//     const data = snapshot.docs.map((doc) => ({
//       id: doc.id,
//       ...doc.data(),
//     }));

//     res.json(data);
//   } catch (error) {
//     console.error("Categories API error:", error);
//     res.status(500).json({ error: error.message });
//   }
// });
//Update Category
router.put("/:id", async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { Name, Description } = req.body;

    if (!Name || !Description) {
      return res.status(400).send({
        success: false,
        message: "Name and Description are required"
      });
    }

    await db.collection("Categories").doc(categoryId).update({
      Name,
      Description,
      updatedAt: new Date(),
    });

    res.send({
      success: true,
      message: "Category Updated Successfully"
    });

  }
  catch (error) {
    console.error("Error Updating Category->Route", error);
    res.status(500).send({
      success: false,
      message: "server error"
    })
  }
});

// Delete Category + Cascade
router.delete("/:id", async (req, res) => {
  const categoryId = req.params.id;

  const softwareSnap = await db
    .collection("Softwares")
    .where("CategoryID", "==", categoryId) // Make sure this matches frontend
    .get();

  for (const doc of softwareSnap.docs) {
    await db.collection("Softwares").doc(doc.id).delete();
  }

  await db.collection("Categories").doc(categoryId).delete();

  res.send({ success: true });
});

module.exports = router;
