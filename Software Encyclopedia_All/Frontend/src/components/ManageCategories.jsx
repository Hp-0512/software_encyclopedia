import React, { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import "../CSS/Managecategory.css";

const ManageCategory = () => {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const categoriesPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  /* ================= FETCH ================= */
  const fetchCategories = async () => {
    const snapshot = await getDocs(collection(db, "Categories"));
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setCategories(data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  /* ================= ADD / UPDATE ================= */
  const handleSave = async () => {
    if (!categoryName.trim() || !categoryDescription.trim()) {
      alert("All fields required");
      return;
    }

    if (editId) {
      await updateDoc(doc(db, "Categories", editId), {
        Name: categoryName,
        Description: categoryDescription,
      });
      setEditId(null);
    } else {
      await addDoc(collection(db, "Categories"), {
        Name: categoryName,
        Description: categoryDescription,
        createdAt: serverTimestamp(),
      });
    }

    setCategoryName("");
    setCategoryDescription("");
    setShowAddModal(false);
    fetchCategories();
  };

  /* ================= DELETE ================= */
  const confirmDelete = async () => {
    await deleteDoc(doc(db, "Categories", deleteId));
    setShowDeleteModal(false);
    fetchCategories();
  };

  /* ================= PAGINATION ================= */
  const indexOfLast = currentPage * categoriesPerPage;
  const indexOfFirst = indexOfLast - categoriesPerPage;
  const currentCategories = categories.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(categories.length / categoriesPerPage);

  return (
    <div className="manage-container">
      <div className="top-bar">
        <button
          className="add-btn"
          onClick={() => {
            setShowAddModal(true);
            setEditId(null);
          }}
        >
          + Add Category
        </button>
      </div>

      <table className="category-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th style={{ textAlign: "center" }}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {currentCategories.map((cat) => (
            <tr key={cat.id}>
              <td>{cat.Name}</td>
              <td>{cat.Description}</td>
              <td className="action-icons">
                <span
                  className="edit-icon"
                  onClick={() => {
                    setCategoryName(cat.Name);
                    setCategoryDescription(cat.Description);
                    setEditId(cat.id);
                    setShowAddModal(true);
                  }}
                >
                  Edit ✏️
                </span>

                <span
                  className="delete-icon"
                  onClick={() => {
                    setDeleteId(cat.id);
                    setShowDeleteModal(true);
                  }}
                >
                  Delete 🗑
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            className={currentPage === i + 1 ? "active-page" : ""}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {showAddModal && (
        <div className="category-overlay">
          <div className="category-modal">
            <h3>{editId ? "Edit Category" : "Add Category"}</h3>

            <input
              type="text"
              placeholder="Category Name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />

            <textarea
              placeholder="Description"
              rows="3"
              value={categoryDescription}
              onChange={(e) => setCategoryDescription(e.target.value)}
            />

            <div className="category-buttons">
              <button
                className="category-cancel"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>

              <button className="category-save" onClick={handleSave}>
                {editId ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Are you sure you want to delete?</h3>

            <div className="modal-buttons">
              <button
                className="cancel-btn"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>

              <button className="delete-btn" onClick={confirmDelete}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCategory;
