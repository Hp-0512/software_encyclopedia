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
  arrayUnion,
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

  const [hoveredId, setHoveredId] = useState(null);
  const [openReactionId, setOpenReactionId] = useState(null);
  const [reactions, setReactions] = useState({});

  const [replyingTo, setReplyingTo] = useState(null);

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
      orderBy("createdAt", "asc"),
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
      reactions: {},
      replyTo: replyingTo
        ? {
            message: replyingTo.message,
            username: replyingTo.username,
            messageId: replyingTo.id, // 🔥 recommended for future highlight feature
          }
        : null,
    });

    setText("");
    setShowEmoji(false);
    setReplyingTo(null); // 🔥 clear reply after sending
  };

  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Message copied");
    } catch (err) {
      console.error("Copy failed", err);
    }
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
                Date.now() - msg.createdAt.toDate().getTime() < 15 * 60 * 1000;

              return (
                <div
                  key={msg.id}
                  className={`chat-row ${isMe ? "me" : "other"}`}
                  onMouseEnter={() => setHoveredId(msg.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {!isMe && (
                    <div className="chat-avatar">
                      {msg.username?.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div className="message-and-trigger-wrapper">
                    {/* MESSAGE BUBBLE */}
                    <div className={`chat-message ${isMe ? "me" : "other"}`}>
                      <div
                        className="chat-content"
                        ref={openMenuId === msg.id ? menuRef : null}
                      >
                        <div className="chat-header-row">
                          <span className="chat-username">{msg.username}</span>

                          {!msg.deleted && (
                            <div
                              className="message-options-btn"
                              onClick={() =>
                                setOpenMenuId(
                                  openMenuId === msg.id ? null : msg.id,
                                )
                              }
                            >
                              ⋮
                            </div>
                          )}
                        </div>

                        <div className="message-body">
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
                            <div className="message-content-wrapper">
                              {msg.deleted ? (
                                <i>This message was deleted</i>
                              ) : (
                                <div className="text-time-container">
                                  {/* REPLY ATTACHED INSIDE MESSAGE */}
                                  {msg.replyTo && (
                                    <div className="reply-attached">
                                      <strong>{msg.replyTo.username}</strong>
                                      <div>{msg.replyTo.message}</div>
                                    </div>
                                  )}

                                  {msg.type === "image" && (
                                    <div className="chat-image">
                                      <img
                                        src={msg.thumbUrl || msg.fileUrl}
                                        alt="uploaded"
                                      />
                                    </div>
                                  )}

                                  <span className="chat-text">
                                    {msg.message}
                                    <span className="chat-time-beside">
                                      {msg.edited && <small> (edited) </small>}
                                      {formatTime(msg.createdAt)}
                                    </span>
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* DROPDOWN MENU */}
                        {openMenuId === msg.id && !msg.deleted && (
                          <div className="message-dropdown">
                            {/* REPLY */}
                            <div
                              onClick={() => {
                                setReplyingTo(msg);
                                setOpenMenuId(null);
                              }}
                            >
                              Reply
                            </div>

                            {/* COPY */}
                            {msg.message && (
                              <div
                                onClick={() => {
                                  navigator.clipboard.writeText(msg.message);
                                  setOpenMenuId(null);
                                }}
                              >
                                Copy Text
                              </div>
                            )}

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

                      {/* REACTION DISPLAY */}
                      {reactions[msg.id] && (
                        <div className="reaction-display">
                          {reactions[msg.id]}
                        </div>
                      )}
                    </div>

                    {/* REACTION BUTTON */}
                    {hoveredId === msg.id && !msg.deleted && (
                      <div style={{ position: "relative" }}>
                        <div
                          className="reaction-trigger"
                          onClick={() =>
                            setOpenReactionId(
                              openReactionId === msg.id ? null : msg.id,
                            )
                          }
                        >
                          😊
                        </div>

                        {openReactionId === msg.id && (
                          <div className="reaction-popup">
                            {["👍", "❤️", "😂", "😮", "😢", "🙏"].map(
                              (emoji) => (
                                <span
                                  key={emoji}
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    setReactions((prev) => ({
                                      ...prev,
                                      [msg.id]: emoji,
                                    }));
                                    setOpenReactionId(null);
                                  }}
                                >
                                  {emoji}
                                </span>
                              ),
                            )}
                          </div>
                        )}
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
            {/* REPLY PREVIEW */}
            {replyingTo && (
              <div className="reply-preview">
                <div className="reply-content">
                  <strong>Replying to {replyingTo.username}</strong>
                  <div className="reply-text">{replyingTo.message}</div>
                </div>
                <span
                  className="reply-close"
                  onClick={() => setReplyingTo(null)}
                >
                  ✕
                </span>
              </div>
            )}

            <ImageUpload currentUser={currentUser} categoryId={categoryId} />

            <button
              className="emoji-btn"
              onClick={() => setShowEmoji(!showEmoji)}
              type="button"
            >
              😊
            </button>

            {showEmoji && (
              <div className="emoji-picker" ref={emojiRef}>
                <EmojiPicker
                  onEmojiClick={(e) => setText((p) => p + e.emoji)}
                />
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
