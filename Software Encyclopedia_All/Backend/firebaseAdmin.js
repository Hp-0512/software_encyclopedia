// const admin = require("firebase-admin");

// const serviceAccount = require("./serviceAccountKey.json");

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount)
// });

// const db = admin.firestore();

// module.exports = db;

const admin = require("firebase-admin");

try {
    const serviceAccount = require("./serviceAccountKey.json");

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });

    const db = admin.firestore();

    module.exports = {
        admin,
        db,
    };

    console.log("Firebase Admin Initialized Successfully");

} catch (error) {
    console.error("Firebase Admin Error:", error);
}