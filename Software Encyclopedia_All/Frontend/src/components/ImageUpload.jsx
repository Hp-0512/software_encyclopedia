// import { useRef, useState } from "react";
// import { db } from "../firebase";
// import { imagekit } from "../imagekit";
// import {
//   collection,
//   addDoc,
//   serverTimestamp,
//   doc,
//   getDoc,
// } from "firebase/firestore";

// export default function ImageUpload({ currentUser, categoryId }) {
//   const fileInputRef = useRef();
//   const [uploading, setUploading] = useState(false);

// const handleImage = async (file) => {
//   if (!file || !currentUser) return;
//   setUploading(true);

//   try {
//     const userSnap = await getDoc(doc(db, "users", currentUser.uid));
//     const username = userSnap.exists() ? userSnap.data().username : "User";

//     const reader = new FileReader();
//     reader.readAsDataURL(file);

//     reader.onloadend = async () => {
//       const base64 = reader.result.split(",")[1];

//       try {
//         // IMPORTANT: The await must be inside here
//         const result = await imagekit.upload({
//           file: base64,
//           fileName: `${Date.now()}_${file.name}`,
//           folder: "/chat-images" // Optional but recommended
//         });

//         await addDoc(collection(db, "groupMessages"), {
//           categoryId,
//           userId: currentUser.uid,
//           username,
//           type: "image",
//           fileUrl: result.url,
//           createdAt: serverTimestamp(),
//           edited: false,
//           deleted: false,
//           deletedFor: [],
//         });
//       } catch (uploadError) {
//         console.error("ImageKit Upload Error:", uploadError);
//         alert("Upload failed. Check if server is running on port 5000.");
//       } finally {
//         setUploading(false);
//       }
//     };
//   } catch (error) {
//     console.error("Firestore Error:", error);
//     setUploading(false);
//   }
// };

//   return (
//     <>
//       <button
//         className="attachment-btn"
//         onClick={() => fileInputRef.current.click()}
//         type="button"
//       >
//         🖼
//       </button>

//       <input
//         type="file"
//         accept="image/*"
//         ref={fileInputRef}
//         style={{ display: "none" }}
//         onChange={(e) => handleImage(e.target.files[0])}
//       />

//       {uploading && <div className="upload-progress">Uploading...</div>}
//     </>
//   );
// }





import { useRef, useState } from "react";
import { db } from "../firebase";
import { imagekit } from "../imagekit";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";

export default function ImageUpload({ currentUser, categoryId }) {
  const fileInputRef = useRef();
  const [uploading, setUploading] = useState(false);

  const handleImage = async (file) => {
    if (!file || !currentUser) return;
    setUploading(true);

    try {
      // Get username
      const userSnap = await getDoc(doc(db, "users", currentUser.uid));
      const username = userSnap.exists() ? userSnap.data().username : "User";

      // Read image as Base64
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onloadend = async () => {
        const base64 = reader.result.split(",")[1];

        try {
          // 1️⃣ Fetch ImageKit authentication parameters from backend
          const authRes = await fetch("http://localhost:5000/auth");
          const authData = await authRes.json();

          // 2️⃣ Upload image to ImageKit
          const result = await imagekit.upload({
            file: base64,
            fileName: `${Date.now()}_${file.name}`,
            folder: "/chat-images",
            publicKey: authData.publicKey,
            signature: authData.signature,
            token: authData.token,
            expire: authData.expire,
          });

          // 3️⃣ Save image as a "message" in Firebase
          await addDoc(collection(db, "groupMessages"), {
            categoryId,
            userId: currentUser.uid,
            username,
            type: "image",
            fileUrl: result.url, // original uploaded image
            thumbUrl: result.url + "?tr=w-300,h-300,fo-auto", // small thumbnail for chat display
            createdAt: serverTimestamp(),
            edited: false,
            deleted: false,
            deletedFor: [],
          });
        } catch (uploadError) {
          console.error("ImageKit Upload Error:", uploadError);
          alert("Upload failed. Check if server is running on port 5000.");
        } finally {
          setUploading(false);
        }
      };
    } catch (error) {
      console.error("Firestore Error:", error);
      setUploading(false);
    }
  };

  return (
    <>
      <button
        className="attachment-btn"
        onClick={() => fileInputRef.current.click()}
        type="button"
      >
        🖼
      </button>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={(e) => handleImage(e.target.files[0])}
      />

      {uploading && <div className="upload-progress">Uploading...</div>}
    </>
  );
}