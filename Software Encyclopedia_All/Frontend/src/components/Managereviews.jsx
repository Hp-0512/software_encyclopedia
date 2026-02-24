// import React, { useEffect, useState } from "react";
// import {
//   collection,
//   getDocs,
//   query,
//   where,
//   deleteDoc,
//   doc,
// } from "firebase/firestore";
// import { db } from "../firebase";

// const ManageReviews = () => {
//   const [reviews, setReviews] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [categoryId, setCategoryId] = useState("");

//   useEffect(() => {
//     fetchCategories();
//     fetchReviews();
//   }, []);

//   /* ================= FETCH CATEGORIES ================= */

//   const fetchCategories = async () => {
//     const snap = await getDocs(collection(db, "Categories"));

//     const data = snap.docs.map((d) => ({
//       id: d.id,
//       ...d.data(),
//     }));

//     setCategories(data);
//   };

//   /* ================= FETCH REVIEWS ================= */

//   const fetchReviews = async (cat = "") => {
//     let q;

//     if (cat) {
//       q = query(collection(db, "Ratings"), where("categoryId", "==", cat));
//     } else {
//       q = collection(db, "Ratings");
//     }

//     const snap = await getDocs(q);

//     const data = snap.docs.map((d) => ({
//       id: d.id,
//       ...d.data(),
//     }));

//     setReviews(data);
//   };

//   /* ================= DELETE ================= */

//   const deleteReview = async (id) => {
//     if (!window.confirm("Delete review?")) return;

//     await deleteDoc(doc(db, "Ratings", id));

//     fetchReviews(categoryId);
//   };

//   /* ================= CATEGORY CHANGE ================= */

//   const handleChange = (e) => {
//     const value = e.target.value;
//     setCategoryId(value);
//     fetchReviews(value);
//   };

//   return (
//     <div>
//       <select onChange={handleChange} value={categoryId}>
//         <option value="">All Categories</option>

//         {categories.map((cat) => (
//           <option key={cat.id} value={cat.id}>
//             {cat.Name}
//           </option>
//         ))}
//       </select>

//       <table border="1" cellPadding="10">
//         <thead>
//           <tr>
//             <th>Software</th>
//             <th>Rating</th>
//             <th>Reviews</th>
//             <th>Username</th>
//             <th>Email</th>
//             <th>Action</th>
//           </tr>
//         </thead>

//         <tbody>
//           {reviews.map((r) => (
//             <tr key={r.id}>
//               <td>{r.softwareName}</td>
//               <td>{r.rating}</td>
//               <td>{r.review}</td>
//               <td>{r.username}</td>
//               <td>{r.email}</td>

//               <td>
//                 <button
//                   style={{ borderColor: "red" }}
//                   onClick={() => deleteReview(r.id)}
//                 >
//                   Delete
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default ManageReviews;

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
import "../css/manageReviews.css";

const ManageReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  /* Pagination */
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;

  useEffect(() => {
    fetchCategories();
    fetchReviews();
  }, []);

  const fetchCategories = async () => {
    const snap = await getDocs(collection(db, "Categories"));
    const data = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));
    setCategories(data);
  };

  const fetchReviews = async (cat = "") => {
    let q;

    if (cat) {
      q = query(collection(db, "Ratings"), where("categoryId", "==", cat));
    } else {
      q = collection(db, "Ratings");
    }

    const snap = await getDocs(q);
    const data = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    setReviews(data);
    setCurrentPage(1);
  };

  const confirmDelete = async () => {
    if (!selectedId) return;

    await deleteDoc(doc(db, "Ratings", selectedId));

    setShowModal(false);
    setSelectedId(null);
    fetchReviews(categoryId);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setCategoryId(value);
    fetchReviews(value);
  };

  /* Pagination Logic */
  const indexOfLast = currentPage * reviewsPerPage;
  const indexOfFirst = indexOfLast - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  const renderStars = (rating) => {
    return (
      <div className="stars">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={i < rating ? "star filled" : "star"}>
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="reviews-container">
      <div className="reviews-header">
        <div className="filter-section">
          <select onChange={handleChange} value={categoryId}>
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.Name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="reviews-table">
          <thead>
            <tr>
              <th>Software</th>
              <th>Rating</th>
              <th>Review</th>
              <th>User</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {currentReviews.length > 0 ? (
              currentReviews.map((r) => (
                <tr key={r.id}>
                  <td className="software">{r.softwareName}</td>
                  <td>{renderStars(r.rating)}</td>
                  <td className="review-text">{r.review}</td>
                  <td>{r.username}</td>
                  <td>{r.email}</td>
                  <td>
                    <button
                      className="deleted-btn"
                      onClick={() => {
                        setSelectedId(r.id);
                        setShowModal(true);
                      }}
                    >
                      Delete 🗑
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-data">
                  No Reviews Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          ◀ Prev
        </button>

        <span>
          Page {currentPage} of {totalPages || 1}
        </span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next ▶
        </button>
      </div>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-icon">⚠</div>

            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this review?</p>

            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>

              <button className="confirm-btn" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageReviews;
