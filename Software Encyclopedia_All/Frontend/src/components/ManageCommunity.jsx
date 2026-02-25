import { useEffect, useState } from "react";
import axios from "axios";
import "../CSS/ManageCommunity.css";

export default function ManageCommunity() {
  const [members, setMembers] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  // ✅ Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const membersPerPage = 5;

  const fetchMembers = async () => {
    const res = await axios.get(
      "https://software-encyclopedia-2.onrender.com/api/community/members",
    );
    setMembers(res.data);
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const confirmRemove = async () => {
    try {
      await axios.delete(
        `https://software-encyclopedia-2.onrender.com/api/community/remove/${selectedId}`,
      );
      setSelectedId(null);
      fetchMembers();
    } catch (error) {
      console.error(error);
    }
  };

  // ✅ Pagination calculations
  const indexOfLast = currentPage * membersPerPage;
  const indexOfFirst = indexOfLast - membersPerPage;
  const currentMembers = members.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(members.length / membersPerPage);

  return (
    <div className="community-container">
      <div className="table-wrapper">
        <table className="community-table">
          <thead>
            <tr>
              <th>Sr no.</th>
              <th>Username</th>
              <th>Email</th>
              <th>Category</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentMembers.map((member, index) => (
              <tr key={member.id}>
                <td>{indexOfFirst + index + 1}</td>
                <td>{member.username}</td>
                <td>{member.email}</td>
                <td>
                  <span className="category-badge">{member.categoryName}</span>
                </td>
                <td>
                  <button
                    className="remove-btn"
                    onClick={() => setSelectedId(member.id)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ✅ Pagination Controls */}
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={currentPage === i + 1 ? "active-page" : ""}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </div>

      {/* Modal */}
      {selectedId && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Confirm Removal</h3>
            <p>Are you sure you want to remove this member?</p>
            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setSelectedId(null)}
              >
                Cancel
              </button>
              <button className="confirm-btn" onClick={confirmRemove}>
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
