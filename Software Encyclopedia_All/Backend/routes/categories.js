
// const express = require("express");
// const router = express.Router();
// const { db } = require("../firebaseAdmin");
// const { messaging } = require("firebase-admin");

// // ➕ Add Category
// router.post("/", async (req, res) => {
//   const { Name, Description } = req.body;

//   if (!Name || !Description) {
//     return res.status(400).send({
//       success: false,
//       message: "Name and Description are required",
//     });
//   }

//   await db.collection("Categories").add({
//     Name,
//     Description,
//     createdAt: new Date(),
//   });

//   res.send({ success: true });
// });

// // 📥 Get Categories
// router.get("/", async (req, res) => {
//   const snapshot = await db.collection("Categories").get();

//   const data = snapshot.docs.map((doc) => ({
//     id: doc.id,
//     ...doc.data(),
//   }));
//   console.log("Categories data", data);

//   res.send(data);
// });

// // router.get("/", async (req, res) => {
// //   try {
// //     const snapshot = await db.collection("categories").get();

// //     const data = snapshot.docs.map((doc) => ({
// //       id: doc.id,
// //       ...doc.data(),
// //     }));

// //     res.json(data);
// //   } catch (error) {
// //     console.error("Categories API error:", error);
// //     res.status(500).json({ error: error.message });
// //   }
// // });


// //Update Category
// router.put("/:id", async (req, res) => {
//   try {
//     const categoryId = req.params.id;
//     const { Name, Description } = req.body;

//     if (!Name || !Description) {
//       return res.status(400).send({
//         success: false,
//         message: "Name and Description are required"
//       });
//     }

//     await db.collection("Categories").doc(categoryId).update({
//       Name,
//       Description,
//       updatedAt: new Date(),
//     });

//     res.send({
//       success: true,
//       message: "Category Updated Successfully"
//     });

//   }
//   catch (error) {
//     console.error("Error Updating Category->Route", error);
//     res.status(500).send({
//       success: false,
//       message: "server error"
//     })
//   }
// });

// // Delete Category + Cascade
// router.delete("/:id", async (req, res) => {
//   const categoryId = req.params.id;

//   const softwareSnap = await db
//     .collection("Softwares")
//     .where("CategoryID", "==", categoryId) // Make sure this matches frontend
//     .get();

//   for (const doc of softwareSnap.docs) {
//     await db.collection("Softwares").doc(doc.id).delete();
//   }

//   await db.collection("Categories").doc(categoryId).delete();

//   res.send({ success: true });
// });

// module.exports = router;
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