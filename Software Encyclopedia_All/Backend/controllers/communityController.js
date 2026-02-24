const admin = require("firebase-admin"); // add this at top
const { db } = require("../firebaseAdmin");

// JOIN GROUP
exports.joinGroup = async (req, res) => {
  try {
    const { userId, username, email, categoryId, categoryName } = req.body;

    const existing = await db.collection("groupMembers")
      .where("userId", "==", userId)
      .where("categoryId", "==", categoryId)
      .get();

    if (!existing.empty) {
      return res.json({ message: "Already joined" });
    }

    await db.collection("groupMembers").add({
      userId,
      username,
      email,
      categoryId,
      categoryName,
      joinedAt: new Date()
    });

    res.json({ message: "Joined successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// GET MEMBERS (Admin)
exports.getMembers = async (req, res) => {
  const snapshot = await db.collection("groupMembers").get();

  const members = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  res.json(members);
};


// REMOVE MEMBER (Admin)
exports.removeMember = async (req, res) => {
  const { id } = req.params;

  await db.collection("groupMembers").doc(id).delete();

  res.json({ message: "User removed" });
};


// SEND MESSAGE
exports.sendMessage = async (req, res) => {
  try {
    const { categoryId, userId, message } = req.body;

    // 🔹 Fetch user details from users collection
    const userSnapshot = await db.collection("users").doc(userId).get();

    if (!userSnapshot.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    const userData = userSnapshot.data();

    await db.collection("groupMessages").add({
      categoryId,
      userId,
      username: userData.username, // ✅ correct username
      message,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({ message: "Message sent" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// GET MESSAGES
exports.getMessages = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const snapshot = await db.collection("groupMessages")
      .where("categoryId", "==", categoryId)
      .orderBy("createdAt", "asc")   // ✅ THIS FIXES EVERYTHING
      .get();

    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json(messages);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};




// CHECK MEMBERSHIP
exports.checkMembership = async (req, res) => {
  const { userId, categoryId } = req.params;

  const snapshot = await db.collection("groupMembers")
    .where("userId", "==", userId)
    .where("categoryId", "==", categoryId)
    .get();

  res.json({ isMember: !snapshot.empty });
};
