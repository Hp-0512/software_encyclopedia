// // // import { useEffect, useState, useRef } from "react";
// // // import axios from "axios";
// // // import { auth } from "../firebase";
// // // import { useParams } from "react-router-dom";

// // // const API = "http://localhost:5000/api/community";

// // // export default function GroupChat() {

// // //   const { categoryId } = useParams();

// // //   const [messages, setMessages] = useState([]);
// // //   const [text, setText] = useState("");
// // //   const [isMember, setIsMember] = useState(false);
// // //   const [loading, setLoading] = useState(true);

// // //   const bottomRef = useRef(null);

// // //   /* ================= AUTO SCROLL ================= */
// // //   useEffect(() => {
// // //     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
// // //   }, [messages]);

// // //   /* ================= CHECK MEMBERSHIP ================= */
// // //   useEffect(() => {
// // //     const checkMembership = async () => {
// // //       try {
// // //         if (!auth.currentUser) return;

// // //         const res = await axios.get(
// // //           `${API}/membership/${auth.currentUser.uid}/${categoryId}`
// // //         );

// // //         setIsMember(res.data.isMember);
// // //         setLoading(false);
// // //       } catch (error) {
// // //         console.error(error);
// // //         setLoading(false);
// // //       }
// // //     };

// // //     checkMembership();
// // //   }, [categoryId]);

// // //   /* ================= FETCH MESSAGES ================= */
// // //   useEffect(() => {
// // //     if (isMember) {
// // //       axios
// // //         .get(`${API}/messages/${categoryId}`)
// // //         .then(res => setMessages(res.data))
// // //         .catch(err => console.error(err));
// // //     }
// // //   }, [isMember, categoryId]);

// // //   /* ================= SEND MESSAGE ================= */
// // //   const sendMessage = async () => {
// // //     if (!text.trim()) return;

// // //     try {
// // //       await axios.post(`${API}/message`, {
// // //         categoryId,
// // //         userId: auth.currentUser.uid,
// // //         username: auth.currentUser.displayName || "User",
// // //         message: text
// // //       });

// // //       setText("");

// // //       // Refresh messages
// // //       const res = await axios.get(`${API}/messages/${categoryId}`);
// // //       setMessages(res.data);

// // //     } catch (error) {
// // //       console.error(error);
// // //     }
// // //   };

// // //   if (loading) return <h3>Loading...</h3>;

// // //   if (!isMember)
// // //     return (
// // //       <div style={{ padding: "40px" }}>
// // //         <h2>Access Restricted</h2>
// // //         <p>Your join request is pending admin approval.</p>
// // //       </div>
// // //     );

// // //   return (
// // //     <div style={{ padding: "40px" }}>
// // //       <h2>{categoryId} Community Chat</h2>

// // //       <div
// // //         style={{
// // //           border: "1px solid #ddd",
// // //           height: "400px",
// // //           overflowY: "scroll",
// // //           padding: "15px",
// // //           marginBottom: "20px",
// // //           background: "#fafafa"
// // //         }}
// // //       >
// // //         {messages.map(msg => (
// // //           <p key={msg.id}>
// // //             <strong>{msg.username}</strong>{" "}
// // //             <small style={{ color: "gray" }}>
// // //               {msg.createdAt?.seconds
// // //                 ? new Date(msg.createdAt.seconds * 1000).toLocaleString()
// // //                 : ""}
// // //             </small>
// // //             : {msg.message}
// // //           </p>
// // //         ))}

// // //         <div ref={bottomRef}></div>
// // //       </div>

// // //       <input
// // //         type="text"
// // //         placeholder="Type your message..."
// // //         value={text}
// // //         onChange={(e) => setText(e.target.value)}
// // //         style={{ width: "70%", padding: "10px" }}
// // //         onKeyDown={(e) => e.key === "Enter" && sendMessage()}
// // //       />

// // //       <button
// // //         onClick={sendMessage}
// // //         style={{ padding: "10px 20px", marginLeft: "10px" }}
// // //       >
// // //         Send
// // //       </button>
// // //     </div>
// // //   );
// // // }



// // // import { collection, query, where, getDocs } from "firebase/firestore";

// // // useEffect(() => {
// // //   const checkMembership = async () => {
// // //     const q = query(
// // //       collection(db, "groupMembers"),
// // //       where("userId", "==", auth.currentUser.uid),
// // //       where("categoryId", "==", categoryId)
// // //     );

// // //     const snapshot = await getDocs(q);

// // //     if (snapshot.empty) {
// // //       setIsMember(false);
// // //     } else {
// // //       setIsMember(true);
// // //     }
// // //   };

// // //   checkMembership();
// // // }, [categoryId]);



// // // import { useEffect, useState } from "react";
// // // import axios from "axios";
// // // import { auth } from "../firebase";
// // // import { useParams } from "react-router-dom";

// // // export default function GroupChat() {

// // //   const { categoryId } = useParams();
// // //   const [messages, setMessages] = useState([]);
// // //   const [text, setText] = useState("");
// // //   const [isMember, setIsMember] = useState(false);

// // //   // Check Membership
// // //   useEffect(() => {
// // //     const check = async () => {
// // //       const res = await axios.get(
// // //         `http://localhost:5000/api/community/membership/${auth.currentUser.uid}/${categoryId}`
// // //       );

// // //       setIsMember(res.data.isMember);
// // //     };

// // //     check();
// // //   }, [categoryId]);

// // //   // Fetch Messages
// // //   useEffect(() => {
// // //     if (!isMember) return;

// // //     const fetchMessages = async () => {
// // //       const res = await axios.get(
// // //         `http://localhost:5000/api/community/messages/${categoryId}`
// // //       );

// // //       setMessages(res.data);
// // //     };

// // //     fetchMessages();
// // //   }, [categoryId, isMember]);

// // //   const sendMessage = async () => {
// // //     if (!text.trim()) return;

// // //     await axios.post("http://localhost:5000/api/community/message", {
// // //       categoryId,
// // //       userId: auth.currentUser.uid,
// // //       username: auth.currentUser.displayName,
// // //       message: text
// // //     });

// // //     setText("");

// // //     const res = await axios.get(
// // //       `http://localhost:5000/api/community/messages/${categoryId}`
// // //     );

// // //     setMessages(res.data);
// // //   };

// // //   if (!isMember) return <h2>Access Denied</h2>;

// // //   return (
// // //     <div style={{ padding: "40px" }}>
// // //       <div style={{backgroundColor:"lightgreen"}}><h2>Group Chat</h2></div>

// // //       <div style={{
// // //         height: "400px",
// // //         overflowY: "scroll",
// // //         border: "1px solid #ddd",
// // //         padding: "15px",
// // //         marginBottom: "15px"
// // //       }}>
// // //         {messages.map(msg => (
// // //           <p key={msg.id}>
// // //             <strong>{msg.username}:</strong> {msg.message}
// // //           </p>
// // //         ))}
// // //       </div>

// // //       <input
// // //       style={{backgroundColor:"#f5efef", border:"2px solid black", color:"#000000"}}
// // //         value={text}
// // //         onChange={(e) => setText(e.target.value)}
// // //       />

// // //       <button style={{backgroundColor:"blueviolet"}} onClick={sendMessage}>
// // //         Send
// // //       </button>
// // //     </div>
// // //   );
// // // }


// // import { useEffect, useState } from "react";
// // import axios from "axios";
// // import { auth } from "../firebase";
// // import { useParams } from "react-router-dom";
// // import Header from "./Header";
// // import "../CSS/GroupChat.css";

// // export default function GroupChat() {

// //   const { categoryId } = useParams();
// //   const [messages, setMessages] = useState([]);
// //   const [text, setText] = useState("");

// //   const fetchMessages = async () => {
// //     const res = await axios.get(
// //       `http://localhost:5000/api/community/messages/${categoryId}`
// //     );
// //     setMessages(res.data);
// //   };

// //   useEffect(() => {
// //     fetchMessages();
// //   }, [categoryId]);

// //   const sendMessage = async () => {
// //     if (!text.trim()) return;

// //     await axios.post("http://localhost:5000/api/community/message", {
// //       categoryId,
// //       userId: auth.currentUser.uid,
// //       message: text
// //     });


// //     setText("");
// //     fetchMessages(); // refresh immediately
// //   };

// //   return (
// //     <>
// //   <Header />

// //   <div className="chat-page">
// //     <div className="chat-container">

// //       <div className="chat-header">
// //         Group Chat
// //       </div>

// //       <div className="chat-messages">
// //         {messages.map(msg => (
// //           <div
// //             key={msg.id}
// //             className={`chat-message ${
// //               msg.userId === auth.currentUser?.uid ? "me" : "other"
// //             }`}
// //           >
// //             <div className="chat-username">
// //               {msg.username || "User"}
// //             </div>
// //             {msg.message}
// //           </div>
// //         ))}
// //       </div>

// //       <div className="chat-input-area">
// //         <input
// //           className="chat-input"
// //           value={text}
// //           onChange={(e) => setText(e.target.value)}
// //           placeholder="Type your message..."
// //         />

// //         <button
// //           className="chat-send-btn"
// //           onClick={sendMessage}
// //         >
// //           Send
// //         </button>
// //       </div>

// //     </div>
// //   </div>
// // </>
// //   )
// // }


// // import { useEffect, useState, useRef } from "react";
// // import axios from "axios";
// // import { auth } from "../firebase";
// // import { useParams } from "react-router-dom";
// // import Header from "./Header";
// // import "../CSS/GroupChat.css";

// // export default function GroupChat() {

// //   const { categoryId } = useParams();
// //   const [messages, setMessages] = useState([]);
// //   const [text, setText] = useState("");
// //   const messagesEndRef = useRef(null);

// //   // ✅ Fetch and sort messages by createdAt
// //   const fetchMessages = async () => {
// //     try {
// //       const res = await axios.get(
// //         `http://localhost:5000/api/community/messages/${categoryId}`
// //       );

// //       const sortedMessages = res.data.sort((a, b) => {
// //         // handle Firestore timestamp or ISO string
// //         const timeA = a.createdAt?.seconds
// //           ? a.createdAt.seconds
// //           : new Date(a.createdAt).getTime();

// //         const timeB = b.createdAt?.seconds
// //           ? b.createdAt.seconds
// //           : new Date(b.createdAt).getTime();

// //         return timeA - timeB;
// //       });

// //       setMessages(sortedMessages);

// //     } catch (error) {
// //       console.error("Error fetching messages:", error);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchMessages();
// //   }, [categoryId]);

// //   // ✅ Auto scroll when messages update
// //   useEffect(() => {
// //     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
// //   }, [messages]);

// //   const sendMessage = async () => {
// //     if (!text.trim()) return;

// //     try {
// //       await axios.post("http://localhost:5000/api/community/message", {
// //         categoryId,
// //         userId: auth.currentUser.uid,
// //         message: text
// //       });

// //       setText("");
// //       fetchMessages();

// //     } catch (error) {
// //       console.error("Error sending message:", error);
// //     }
// //   };

// //   return (
// //     <>
// //       <Header />

// //       <div className="chat-page">
// //         <div className="chat-container">

// //           <div className="chat-header">
// //             Group Chat
// //           </div>

// //           <div className="chat-messages">
// //             {messages.map(msg => (
// //               <div
// //                 key={msg.id}
// //                 className={`chat-message ${
// //                   msg.userId === auth.currentUser?.uid ? "me" : "other"
// //                 }`}
// //               >
// //                 <div className="chat-username">
// //                   {msg.username || "User"}
// //                 </div>

// //                 {msg.message}
// //               </div>
// //             ))}

// //             {/* auto scroll anchor */}
// //             <div ref={messagesEndRef} />
// //           </div>

// //           <div className="chat-input-area">
// //             <input
// //               className="chat-input"
// //               value={text}
// //               onChange={(e) => setText(e.target.value)}
// //               placeholder="Type your message..."
// //               onKeyDown={(e) => {
// //                 if (e.key === "Enter") sendMessage();
// //               }}
// //             />

// //             <button
// //               className="chat-send-btn"
// //               onClick={sendMessage}
// //             >
// //               Send
// //             </button>
// //           </div>

// //         </div>
// //       </div>
// //     </>
// //   );
// // }


// import { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import { auth, db } from "../firebase";
// import { useParams } from "react-router-dom";
// import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
// import Header from "./Header";
// import "../CSS/GroupChat.css";

// export default function GroupChat() {

//   const { categoryId } = useParams();
//   const [messages, setMessages] = useState([]);
//   const [text, setText] = useState("");
//   const [currentUser, setCurrentUser] = useState(null);
//   const [authLoading, setAuthLoading] = useState(true);
//   const messagesEndRef = useRef(null);

//   // ✅ Wait for Firebase auth session restore
//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged((user) => {
//       setCurrentUser(user);
//       setAuthLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   // ✅ REAL-TIME MESSAGE LISTENER
//   useEffect(() => {
//     if (!currentUser || !categoryId) return;

//     const q = query(
//       collection(db, "groupMessages"),
//       where("categoryId", "==", categoryId),
//       orderBy("createdAt", "asc")
//     );

//     const unsubscribe = onSnapshot(q, (snapshot) => {
//       const msgs = snapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data()
//       }));

//       setMessages(msgs);
//     });

//     return () => unsubscribe();

//   }, [categoryId, currentUser]);

//   // ✅ Auto scroll
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // ✅ Send message (still using backend for username logic)
//   const sendMessage = async () => {
//     if (!text.trim() || !currentUser) return;

//     try {
//       await axios.post("http://localhost:5000/api/community/message", {
//         categoryId,
//         userId: currentUser.uid,
//         message: text
//       });

//       setText("");

//     } catch (error) {
//       console.error("Error sending message:", error);
//     }
//   };

//   // Prevent rendering before auth ready
//   if (authLoading) {
//     return (
//       <>
//         <Header />
//         <div className="chat-page">
//           <div className="chat-container">
//             <div className="chat-header">Group Chat</div>
//             <div className="chat-messages">Loading chat...</div>
//           </div>
//         </div>
//       </>
//     );
//   }

//   return (
//     <>
//       <Header />

//       <div className="chat-page">
//         <div className="chat-container">

//           <div className="chat-header">
//             Group Chat
//           </div>

//           <div className="chat-messages">
//             {messages.map(msg => {
//               const isMe =
//                 String(msg.userId) === String(currentUser?.uid);

//               return (
//                 <div
//                   key={msg.id}
//                   className={`chat-message ${isMe ? "me" : "other"}`}
//                 >
//                   <div className="chat-username">
//                     {msg.username || "User"}
//                   </div>

//                   {msg.message}
//                 </div>
//               );
//             })}

//             <div ref={messagesEndRef} />
//           </div>

//           <div className="chat-input-area">
//             <input
//               className="chat-input"
//               value={text}
//               onChange={(e) => setText(e.target.value)}
//               placeholder="Type your message..."
//               onKeyDown={(e) => {
//                 if (e.key === "Enter") sendMessage();
//               }}
//             />

//             <button
//               className="chat-send-btn"
//               onClick={sendMessage}
//             >
//               Send
//             </button>
//           </div>

//         </div>
//       </div>
//     </>
//   );
// }

// import { useEffect, useState, useRef } from "react";
// import { auth, db } from "../firebase";
// import { useParams } from "react-router-dom";
// import {
//   collection,
//   query,
//   where,
//   orderBy,
//   onSnapshot,
//   addDoc,
//   serverTimestamp
// } from "firebase/firestore";
// import Header from "./Header";
// import "../CSS/GroupChat.css";
// import EmojiPicker from "emoji-picker-react";

// export default function GroupChat() {
//   const { categoryId } = useParams();

//   const [messages, setMessages] = useState([]);
//   const [text, setText] = useState("");
//   const [currentUser, setCurrentUser] = useState(null);
//   const [authLoading, setAuthLoading] = useState(true);
//   const [showEmoji, setShowEmoji] = useState(false);

//   const messagesEndRef = useRef(null);

//   // ✅ Wait for Firebase Auth
//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged((user) => {
//       setCurrentUser(user);
//       setAuthLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   // ✅ Real-time Firestore Listener
//   useEffect(() => {
//     if (!currentUser || !categoryId) return;

//     const q = query(
//       collection(db, "groupMessages"),
//       where("categoryId", "==", categoryId),
//       orderBy("createdAt", "asc")
//     );

//     const unsubscribe = onSnapshot(q, (snapshot) => {
//       const msgs = snapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       setMessages(msgs);
//     });

//     return () => unsubscribe();
//   }, [categoryId, currentUser]);

//   // ✅ Auto scroll
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // ✅ Send Message
//   const sendMessage = async () => {
//     if (!text.trim() || !currentUser) return;

//     try {
//       await addDoc(collection(db, "groupMessages"), {
//         categoryId,
//         userId: currentUser.uid,
//         username: currentUser.displayName || "User",
//         message: text.trim(),
//         createdAt: serverTimestamp(),
//       });

//       setText("");
//       setShowEmoji(false);
//     } catch (error) {
//       console.error("Error sending message:", error);
//     }
//   };

//   // ✅ Emoji Click
//   const handleEmojiClick = (emojiData) => {
//     setText((prev) => prev + emojiData.emoji);
//   };

//   // ✅ Format Time
//   const formatTime = (timestamp) => {
//     if (!timestamp) return "";
//     const date = timestamp.toDate();
//     return date.toLocaleTimeString([], {
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   // ✅ Format Date Label (Today / Yesterday / Full Date)
//   const formatDateLabel = (date) => {
//     const today = new Date();
//     const yesterday = new Date();
//     yesterday.setDate(today.getDate() - 1);

//     if (date.toDateString() === today.toDateString()) {
//       return "Today";
//     }

//     if (date.toDateString() === yesterday.toDateString()) {
//       return "Yesterday";
//     }

//     return date.toLocaleDateString("en-GB", {
//       day: "numeric",
//       month: "long",
//       year: "numeric",
//     });
//   };

//   if (authLoading) {
//     return (
//       <>
//         <Header />
//         <div className="chat-page">
//           <div className="chat-container">
//             <div className="chat-header">Group Chat</div>
//             <div className="chat-messages">Loading chat...</div>
//           </div>
//         </div>
//       </>
//     );
//   }

//   return (
//     <>
//       <Header />

//       <div className="chat-page">
//         <div className="chat-container">

//           <div className="chat-header">Group Chat</div>

//           <div className="chat-messages">
//             {messages.map((msg, index) => {
//               const isMe =
//                 String(msg.userId) === String(currentUser?.uid);

//               const currentDate = msg.createdAt?.toDate();
//               const prevDate =
//                 index > 0
//                   ? messages[index - 1].createdAt?.toDate()
//                   : null;

//               const showDateSeparator =
//                 !prevDate ||
//                 currentDate?.toDateString() !==
//                   prevDate?.toDateString();

//               return (
//                 <div key={msg.id}>

//                   {showDateSeparator && currentDate && (
//                     <div className="chat-date-separator">
//                       {formatDateLabel(currentDate)}
//                     </div>
//                   )}

//                   <div
//                     className={`chat-message ${
//                       isMe ? "me" : "other"
//                     }`}
//                   >
//                     <div className="chat-username">
//                       {msg.username || "User"}
//                     </div>

//                     <div className="chat-text">
//                       {msg.message}
//                     </div>

//                     <div className="chat-time">
//                       {msg.createdAt &&
//                         formatTime(msg.createdAt)}
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}

//             <div ref={messagesEndRef} />
//           </div>

//           <div className="chat-input-area">

//             <button
//               className="emoji-btn"
//               onClick={() => setShowEmoji(!showEmoji)}
//               type="button"
//             >
//               😊
//             </button>

//             {showEmoji && (
//               <div className="emoji-picker">
//                 <EmojiPicker onEmojiClick={handleEmojiClick} />
//               </div>
//             )}

//             <input
//               className="chat-input"
//               value={text}
//               onChange={(e) => setText(e.target.value)}
//               placeholder="Type your message..."
//               onKeyDown={(e) => {
//                 if (e.key === "Enter") {
//                   e.preventDefault();
//                   sendMessage();
//                 }
//               }}
//             />

//             <button
//               className="chat-send-btn"
//               onClick={sendMessage}
//               type="button"
//             >
//               Send
//             </button>

//           </div>
//         </div>
//       </div>
//     </>
//   );
// }


// import { useEffect, useState, useRef } from "react";
// import { auth, db } from "../firebase";
// import { useParams } from "react-router-dom";
// import {
//   collection,
//   query,
//   where,
//   orderBy,
//   onSnapshot,
//   addDoc,
//   serverTimestamp,
//   doc,
//   getDoc
// } from "firebase/firestore";
// import Header from "./Header";
// import "../CSS/GroupChat.css";
// import EmojiPicker from "emoji-picker-react";

// export default function GroupChat() {
//   const { categoryId } = useParams();

//   const [messages, setMessages] = useState([]);
//   const [text, setText] = useState("");
//   const [currentUser, setCurrentUser] = useState(null);
//   const [username, setUsername] = useState(""); // ✅ REAL NAME
//   const [authLoading, setAuthLoading] = useState(true);
//   const [showEmoji, setShowEmoji] = useState(false);

//   const messagesEndRef = useRef(null);

//   // ✅ Wait for Firebase Auth
//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged((user) => {
//       setCurrentUser(user);
//       setAuthLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   // ✅ Fetch Username from users collection
//   useEffect(() => {
//     const fetchUsername = async () => {
//       if (!currentUser) return;

//       try {
//         const userRef = doc(db, "users", currentUser.uid);
//         const userSnap = await getDoc(userRef);

//         if (userSnap.exists()) {
//           // 🔥 Make sure this matches your field name
//           setUsername(userSnap.data().name);
//         }
//       } catch (error) {
//         console.error("Error fetching username:", error);
//       }
//     };

//     fetchUsername();
//   }, [currentUser]);

//   // ✅ Real-time Firestore Listener
//   useEffect(() => {
//     if (!currentUser || !categoryId) return;

//     const q = query(
//       collection(db, "groupMessages"),
//       where("categoryId", "==", categoryId),
//       orderBy("createdAt", "asc")
//     );

//     const unsubscribe = onSnapshot(q, (snapshot) => {
//       const msgs = snapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       setMessages(msgs);
//     });

//     return () => unsubscribe();
//   }, [categoryId, currentUser]);

//   // ✅ Auto scroll
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // ✅ Send Message
// const sendMessage = async () => {
//   if (!text.trim() || !currentUser) return;

//   try {
//     const userRef = doc(db, "users", currentUser.uid);
//     const userSnap = await getDoc(userRef);

//     let realUsername = "User";

//     if (userSnap.exists()) {
//       realUsername = userSnap.data().username || "User";
//     }

//     await addDoc(collection(db, "groupMessages"), {
//       categoryId,
//       userId: currentUser.uid,
//       username: realUsername, // ✅ now matches your Firestore field
//       message: text.trim(),
//       createdAt: serverTimestamp(),
//     });

//     setText("");
//     setShowEmoji(false);
//   } catch (error) {
//     console.error("Error sending message:", error);
//   }
// };


//   // ✅ Emoji Click
//   const handleEmojiClick = (emojiData) => {
//     setText((prev) => prev + emojiData.emoji);
//   };

//   // ✅ Format Time
//   const formatTime = (timestamp) => {
//     if (!timestamp) return "";
//     const date = timestamp.toDate();
//     return date.toLocaleTimeString([], {
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   // ✅ Format Date Label
//   const formatDateLabel = (date) => {
//     const today = new Date();
//     const yesterday = new Date();
//     yesterday.setDate(today.getDate() - 1);

//     if (date.toDateString() === today.toDateString()) {
//       return "Today";
//     }

//     if (date.toDateString() === yesterday.toDateString()) {
//       return "Yesterday";
//     }

//     return date.toLocaleDateString("en-GB", {
//       day: "numeric",
//       month: "long",
//       year: "numeric",
//     });
//   };

//   if (authLoading) {
//     return (
//       <>
//         <Header />
//         <div className="chat-page">
//           <div className="chat-container">
//             <div className="chat-header">Group Chat</div>
//             <div className="chat-messages">Loading chat...</div>
//           </div>
//         </div>
//       </>
//     );
//   }

//   return (
//     <>
//       <Header />

//       <div className="chat-page">
//         <div className="chat-container">

//           <div className="chat-header">
//             <div className="chat-title">Community Discussion</div>
//             <div className="chat-subtitle">
//               Real-time conversation space
//             </div>
//           </div>


//           <div className="chat-messages">
//             {messages.map((msg, index) => {
//   const isMe = String(msg.userId) === String(currentUser?.uid);

//   const currentDate = msg.createdAt?.toDate();
//   const prevDate =
//     index > 0 ? messages[index - 1].createdAt?.toDate() : null;

//   const showDateSeparator =
//     !prevDate ||
//     currentDate?.toDateString() !== prevDate?.toDateString();

//   return (
//     <>

//       {showDateSeparator && currentDate && (
//         <div className="chat-date-separator">
//           {formatDateLabel(currentDate)}
//         </div>
//       )}

//       <div
//         key={msg.id}
//         className={`chat-message ${isMe ? "me" : "other"}`}
//       >
//         <div className="chat-username">
//           {msg.username || "User"}
//         </div>

//         <div className="chat-text">
//           {msg.message}
//         </div>

//         <div className="chat-time">
//           {msg.createdAt && formatTime(msg.createdAt)}
//         </div>
//       </div>

//     </>
//   );
// })}


//             <div ref={messagesEndRef} />
//           </div>

//           <div className="chat-input-area">

//             <button
//               className="emoji-btn"
//               onClick={() => setShowEmoji(!showEmoji)}
//               type="button"
//             >
//               😊
//             </button>

//             {showEmoji && (
//               <div className="emoji-picker">
//                 <EmojiPicker onEmojiClick={handleEmojiClick} />
//               </div>
//             )}

//             <input
//               className="chat-input"
//               value={text}
//               onChange={(e) => setText(e.target.value)}
//               placeholder="Type your message..."
//               onKeyDown={(e) => {
//                 if (e.key === "Enter") {
//                   e.preventDefault();
//                   sendMessage();
//                 }
//               }}
//             />

//             <button
//               className="chat-send-btn"
//               onClick={sendMessage}
//               type="button"
//             >
//               Send
//             </button>

//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// import { useEffect, useState, useRef } from "react";
// import { auth, db } from "../firebase";
// import { useParams } from "react-router-dom";
// import {
//   collection,
//   query,
//   where,
//   orderBy,
//   onSnapshot,
//   addDoc,
//   serverTimestamp,
//   doc,
//   getDoc
// } from "firebase/firestore";
// import Header from "./Header";
// import "../CSS/GroupChat.css";
// import EmojiPicker from "emoji-picker-react";

// export default function GroupChat() {
//   const { categoryId } = useParams();

//   const [messages, setMessages] = useState([]);
//   const [text, setText] = useState("");
//   const [currentUser, setCurrentUser] = useState(null);
//   const [authLoading, setAuthLoading] = useState(true);
//   const [showEmoji, setShowEmoji] = useState(false);
//   const emojiRef = useRef(null);
//   const messagesEndRef = useRef(null);
//   const [chatLoading, setChatLoading] = useState(true);

//   useEffect(() => {
//   function handleClickOutside(event) {
//     if (emojiRef.current && !emojiRef.current.contains(event.target)) {
//       setShowEmoji(false);
//     }
//   }

//   document.addEventListener("mousedown", handleClickOutside);
//   return () => {
//     document.removeEventListener("mousedown", handleClickOutside);
//   };
// }, []);

//   /* ================= AUTH ================= */
//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged((user) => {
//       setCurrentUser(user);
//       setAuthLoading(false);
//     });
//     return () => unsubscribe();
//   }, []);

//   /* ================= REAL-TIME MESSAGES ================= */
//   useEffect(() => {
//     if (!currentUser || !categoryId) return;

//     const q = query(
//       collection(db, "groupMessages"),
//       where("categoryId", "==", categoryId),
//       orderBy("createdAt", "asc")
//     );

//     const unsubscribe = onSnapshot(q, (snapshot) => {
//       const msgs = snapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));

//       setMessages(msgs);
//       setChatLoading(false); // ✅ STOP SPINNER HERE
//     });

//     return () => unsubscribe();
//   }, [categoryId, currentUser]);

//   /* ================= AUTO SCROLL ================= */
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   /* ================= SEND MESSAGE ================= */
//   const sendMessage = async () => {
//     if (!text.trim() || !currentUser) return;

//     try {
//       const userRef = doc(db, "users", currentUser.uid);
//       const userSnap = await getDoc(userRef);

//       let realUsername = "User";
//       if (userSnap.exists()) {
//         realUsername = userSnap.data().username || "User";
//       }

//       await addDoc(collection(db, "groupMessages"), {
//         categoryId,
//         userId: currentUser.uid,
//         username: realUsername,
//         message: text, // keep original text (preserve \n)
//         createdAt: serverTimestamp(),
//       });

//       setText("");
//       setShowEmoji(false);
//     } catch (error) {
//       console.error("Error sending message:", error);
//     }
//   };

//   /* ================= EMOJI ================= */
//   const handleEmojiClick = (emojiData) => {
//     setText((prev) => prev + emojiData.emoji);
//   };

//   /* ================= TIME FORMAT ================= */
//   const formatTime = (timestamp) => {
//     if (!timestamp) return "";
//     const date = timestamp.toDate();
//     return date.toLocaleTimeString([], {
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   const formatDateLabel = (date) => {
//     const today = new Date();
//     const yesterday = new Date();
//     yesterday.setDate(today.getDate() - 1);

//     if (date.toDateString() === today.toDateString()) return "Today";
//     if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

//     return date.toLocaleDateString("en-GB", {
//       day: "numeric",
//       month: "long",
//       year: "numeric",
//     });
//   };

//   if (authLoading || chatLoading) {
//     return (
//       <>
//         <Header />
//         <div className="chat-page spinner-center">
//           <div className="spinner"></div>
//         </div>
//       </>
//     );
//   }
//   return (
//     <>
//       <Header />

//       <div className="chat-page">
//         <div className="chat-container">
        
//           <div className="chat-header">
//             <div>Community Discussion</div>
//             <div style={{ fontSize: "14px", opacity: 0.8 }}>
//               Real-time conversation space
//             </div>
//           </div>

//           <div className="chat-messages">
//             {messages.map((msg, index) => {
//               const isMe = msg.userId === currentUser?.uid;

//               const currentDate = msg.createdAt?.toDate();
//               const prevDate =
//                 index > 0 ? messages[index - 1].createdAt?.toDate() : null;

//               const showDateSeparator =
//                 !prevDate ||
//                 currentDate?.toDateString() !== prevDate?.toDateString();

//               return (
//                 <div key={msg.id}>
//                   {showDateSeparator && currentDate && (
//                     <div className="chat-date-separator">
//                       {formatDateLabel(currentDate)}
//                     </div>
//                   )}

//                   <div className={`chat-message ${isMe ? "me" : "other"}`}>
//                     <div className="chat-username">
//                       {msg.username || "User"}
//                     </div>

//                     <div className="chat-content">
//                       <span className="chat-text">{msg.message}</span>
//                       <span className="chat-time-inline">
//                         {msg.createdAt && formatTime(msg.createdAt)}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}

//             <div ref={messagesEndRef} />
//           </div>

//           <div className="chat-input-area">
//             <button
//               className="emoji-btn"
//               onClick={() => setShowEmoji(!showEmoji)}
//               type="button"
//             >
//               😊
//             </button>

//             {showEmoji && (
//               <div className="emoji-picker" ref={emojiRef}>
//                 <EmojiPicker onEmojiClick={handleEmojiClick} />
//               </div>
//             )}

//             {/* ✅ TEXTAREA INSTEAD OF INPUT */}
//             <textarea
//               className="chat-input"
//               value={text}
//               onChange={(e) => setText(e.target.value)}
//               placeholder="Type your message..."
//               rows={1}
//               onKeyDown={(e) => {
//                 if (e.key === "Enter" && !e.shiftKey) {
//                   e.preventDefault();
//                   sendMessage();
//                 }
//               }}
//             />

//             <button
//               className="chat-send-btn"
//               onClick={sendMessage}
//               type="button"
//             >
//               Send
//             </button>
//           </div>

//         </div>
//       </div>
//     </>
//   );
// }

import { useEffect, useState, useRef } from "react";
import { auth, db } from "../firebase";
import { useParams } from "react-router-dom";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  updateDoc,
  arrayUnion
} from "firebase/firestore";
import Header from "./Header";
import "../CSS/GroupChat.css";
import EmojiPicker from "emoji-picker-react";
import ImageUpload from "./ImageUpload";

export default function GroupChat() {
  const { categoryId } = useParams();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(true);

  const [showEmoji, setShowEmoji] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleteType, setDeleteType] = useState(null);

  const emojiRef = useRef(null);
  const menuRef = useRef(null);
  const messagesEndRef = useRef(null);

  /* ================= CLOSE EMOJI ================= */
  useEffect(() => {
    function handleClickOutside(event) {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setShowEmoji(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ================= AUTH ================= */
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  /* ================= REAL-TIME MESSAGES ================= */
  useEffect(() => {
    if (!currentUser || !categoryId) return;

    const q = query(
      collection(db, "groupMessages"),
      where("categoryId", "==", categoryId),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMessages(msgs);
      setChatLoading(false);
    });

    return () => unsubscribe();
  }, [categoryId, currentUser]);

  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ================= SEND MESSAGE ================= */
  const sendMessage = async () => {
    if (!text.trim() || !currentUser) return;

    const userRef = doc(db, "users", currentUser.uid);
    const userSnap = await getDoc(userRef);

    let realUsername = "User";
    if (userSnap.exists()) {
      realUsername = userSnap.data().username || "User";
    }

    await addDoc(collection(db, "groupMessages"), {
      categoryId,
      userId: currentUser.uid,
      username: realUsername,
      message: text,
      createdAt: serverTimestamp(),
      edited: false,
      deleted: false,
      deletedFor: [],
    });

    setText("");
    setShowEmoji(false);
  };

  /* ================= EDIT ================= */
  const startEdit = (msg) => {
    setEditingId(msg.id);
    setEditText(msg.message);
    setOpenMenuId(null);
  };

  const saveEdit = async (msg) => {
    if (!editText.trim()) return;

    const msgRef = doc(db, "groupMessages", msg.id);

    await updateDoc(msgRef, {
      message: editText,
      edited: true,
    });

    setEditingId(null);
  };

  /* ================= DELETE ================= */
  const deleteForEveryone = async (msgId) => {
    await updateDoc(doc(db, "groupMessages", msgId), {
      message: "",
      deleted: true,
    });
  };

  const deleteForMe = async (msgId) => {
    await updateDoc(doc(db, "groupMessages", msgId), {
      deletedFor: arrayUnion(currentUser.uid),
    });
  };

  /* ================= TIME ================= */
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate();
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /* ================= LOADING ================= */
  if (authLoading || chatLoading) {
    return (
      <>
        <Header />
        <div className="chat-page spinner-center">
          <div className="spinner"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />

      <div className="chat-page">
        <div className="chat-container">
          <div className="chat-header">
            <div>Community Discussion</div>
            <div style={{ fontSize: "14px", opacity: 0.8 }}>
              Real-time conversation space
            </div>
          </div>

          <div className="chat-messages">
            {messages.map((msg) => {
              if (msg.deletedFor?.includes(currentUser.uid)) return null;

              const isMe = msg.userId === currentUser.uid;

              const canEdit =
                isMe &&
                msg.createdAt &&
                Date.now() - msg.createdAt.toDate().getTime() <
                  15 * 60 * 1000;

              return (
                <div
                  key={msg.id}
                  className={`chat-message ${isMe ? "me" : "other"}`}
                >
                  <div
                    className="chat-content"
                    ref={openMenuId === msg.id ? menuRef : null}
                  >
                    {/* HEADER ROW (USERNAME + 3 DOTS) */}
                    <div className="chat-header-row">
                      <span className="chat-username">{msg.username}</span>

                      {!msg.deleted && (
                        <div
                          className="message-options-btn"
                          onClick={() =>
                            setOpenMenuId(openMenuId === msg.id ? null : msg.id)
                          }
                        >
                          ⋮
                        </div>
                      )}
                    </div>

                    {/* MESSAGE BODY */}
                    {editingId === msg.id ? (
                      <div className="edit-inline">
                        <input
                          className="edit-input"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          autoFocus
                        />
                        <button
                          className="edit-save-btn"
                          onClick={() => saveEdit(msg)}
                        >
                          ✔
                        </button>
                      </div>
                    ) : (
                      <>
                        {msg.deleted ? (
                          <i>This message was deleted</i>
                        ) : (
                          <>
                            {/* {msg.type === "image" && (
                              <div className="chat-image">
                                <img
                                  src={msg.fileUrl}
                                  alt="uploaded"
                                  onClick={() => window.open(msg.fileUrl, "_blank")}
                                />
                              </div>
                            )} */}
                            {msg.type === "image" && (
                              <div className="chat-image">
                                <img
                                  src={msg.thumbUrl || msg.fileUrl}
                                  alt="uploaded"
                                  onClick={() => window.open(msg.fileUrl, "_blank")}
                                />
                              </div>
                            )}

                            {msg.type === "file" && (
                              <div className="chat-file">
                                <a href={msg.fileUrl} target="_blank" rel="noreferrer">
                                  📄 {msg.fileName}
                                </a>
                              </div>
                            )}

                            {(!msg.type || msg.type === "text") && (
                              <span className="chat-text">
                                {msg.message}
                              </span>
                            )}
                          </>
                        )}

                        {msg.edited && !msg.deleted && (
                          <span className="edited-label"> (edited)</span>
                        )}

                        <span className="chat-time-inline">
                          {formatTime(msg.createdAt)}
                        </span>
                      </>
                    )}

                    {/* DROPDOWN MENU */}
                    {openMenuId === msg.id && !msg.deleted && (
                      <div className="message-dropdown">
                        {canEdit && (
                          <div onClick={() => startEdit(msg)}>Edit</div>
                        )}

                        {isMe && (
                          <div
                            onClick={() => {
                              setConfirmDelete(msg.id);
                              setDeleteType("everyone");
                            }}
                          >
                            Delete for everyone
                          </div>
                        )}

                        <div
                          onClick={() => {
                            setConfirmDelete(msg.id);
                            setDeleteType("me");
                          }}
                        >
                          Delete for me
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            <div ref={messagesEndRef} />
          </div>

          {/* DELETE MODAL */}
          {confirmDelete && (
            <div className="delete-modal">
              <div className="delete-box">
                <p>Are you sure you want to delete this message?</p>
                <div className="delete-actions">
                  <button
                    onClick={() => {
                      setConfirmDelete(null);
                      setDeleteType(null);
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    className="danger"
                    onClick={async () => {
                      if (deleteType === "everyone") {
                        await deleteForEveryone(confirmDelete);
                      } else {
                        await deleteForMe(confirmDelete);
                      }
                      setConfirmDelete(null);
                      setDeleteType(null);
                      setOpenMenuId(null);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* INPUT AREA */}
          <div className="chat-input-area">

            <ImageUpload
              currentUser={currentUser}
              categoryId={categoryId}
            />
              
            <button
              className="emoji-btn"
              onClick={() => setShowEmoji(!showEmoji)}
              type="button"
            >
              😊
            </button>

            {showEmoji && (
              <div className="emoji-picker" ref={emojiRef}>
                <EmojiPicker onEmojiClick={(e) => setText((p) => p + e.emoji)} />
              </div>
            )}

            

            <textarea
              className="chat-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type your message..."
              rows={1}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />

            <button
              className="chat-send-btn"
              onClick={sendMessage}
              type="button"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
}