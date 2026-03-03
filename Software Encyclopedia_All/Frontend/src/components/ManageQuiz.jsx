import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
import "../CSS/ManageQuiz.css";

const ManageQuiz = () => {
  const [Result, setResult] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    fetchCategories();
    fetchResult();
  }, []);

  /* ================= FETCH CATEGORIES ================= */

  const fetchCategories = async () => {
    const snap = await getDocs(collection(db, "Categories"));

    const data = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    setCategories(data);
  };

  const fetchResult = async (cat = "") => {
    if (!cat) {
      setResult([]); // Clear table
      return;
    }

    const q = query(
      collection(db, "quizResults"),
      where("categoryId", "==", cat),
    );

    const snap = await getDocs(q);

    const data = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    setResult(data);
  };

  /* ================= DELETE ================= */

  // const deleteresult = async (id) => {
  //   if (!window.confirm("Delete Result?")) return;

  //   await deleteDoc(doc(db, "quizResults", id));

  //   fetchResult(categoryId);
  // };
  const deleteresult = async () => {
    if (!selectedId) return;

    await deleteDoc(doc(db, "quizResults", selectedId));

    setShowModal(false);
    setSelectedId(null);
    fetchResult(categoryId);
  };

  /* ================= CATEGORY CHANGE ================= */

  const handleChange = (e) => {
    const value = e.target.value;
    setCategoryId(value);
    fetchResult(value);
  };

  return (
    <div className="quiz-container">
      <div className="quiz-card">
        <div className="quiz-header">
          <select
            className="category-select"
            onChange={handleChange}
            value={categoryId}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.Name}
              </option>
            ))}
          </select>
        </div>

        <div className="table-wrapper">
          <table className="quiz-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Total Questions</th>
                <th>Correct Answers</th>
                <th>Percentage</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {categoryId === "" ? (
                <tr>
                  <td colSpan="6" className="message-cell">
                    Please select a category
                  </td>
                </tr>
              ) : Result.length === 0 ? (
                <tr>
                  <td colSpan="6" className="message-cell">
                    No quiz results found
                  </td>
                </tr>
              ) : (
                Result.map((res) => (
                  <tr key={res.id}>
                    <td>{res.username}</td>
                    <td>{res.email}</td>
                    <td>{res.totalQuestions}</td>
                    <td>{res.score}</td>
                    <td>{res.percentage}%</td>
                    <td>
                      <button
                        className="deleted-btn"
                        onClick={() => {
                          setSelectedId(res.id);
                          setShowModal(true);
                        }}
                      >
                        Delete 🗑
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this result?</p>

            <div className="modal-buttons">
              <button className="confirm-btn" onClick={deleteresult}>
                Yes, Delete
              </button>

              <button
                className="cancel-btn"
                onClick={() => {
                  setShowModal(false);
                  setSelectedId(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageQuiz;
