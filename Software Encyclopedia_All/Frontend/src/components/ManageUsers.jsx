import { useEffect, useState } from "react";
import axios from "axios";
import "../CSS/ManageUsers.css";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const usersPerPage = 5;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios
      .get("https://software-encyclopedia-2.onrender.com/api/users")
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
        setLoading(false);
      });
  };

  // const handleDelete = (id) => {
  //   if (!window.confirm("Are you sure you want to delete this user?")) return;

  //   axios
  //     .delete(`https://software-encyclopedia-2.onrender.com/api/users/${id}`)
  //     .then(() => {
  //       setUsers(users.filter((user) => user.id !== id));
  //     })
  //     .catch((err) => {
  //       console.error("Error deleting user:", err);
  //     });
  // };

  const handleDeleteClick = (id) => {
    setSelectedUserId(id);
    setShowModal(true);
  };
  const confirmDelete = () => {
    axios
      .delete(
        `https://software-encyclopedia-2.onrender.com/api/users/${selectedUserId}`,
      )
      .then(() => {
        setUsers(users.filter((user) => user.id !== selectedUserId));
        setShowModal(false);
        setSelectedUserId(null);
      })
      .catch((err) => {
        console.error("Error deleting user:", err);
      });
  };

  // 🔎 Search Filter
  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()),
  );

  // 🔄 Sorting
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortOrder === "asc") {
      return a.username.localeCompare(b.username);
    } else {
      return b.username.localeCompare(a.username);
    }
  });

  // 📄 Pagination
  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);

  return (
    <div className="manage-users-container">
      {/* Search */}
      <input
        type="text"
        placeholder="Search by name or email..."
        className="search-input"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <div className="loader">Loading...</div>
      ) : (
        <>
          <table className="users-table">
            <thead>
              <tr>
                <th
                  onClick={() =>
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                  }
                >
                  Name ⬍
                </th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {currentUsers.length > 0 ? (
                currentUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>
                      <button
                        className="deleted-btn"
                        onClick={() => handleDeleteClick(user.id)}
                      >
                        Delete 🗑
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="no-data">
                    No Users Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Prev
            </button>

            <span>
              Page {currentPage} of {totalPages || 1}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
          {showModal && (
            <div className="modal-overlay">
              <div className="modal">
                <h3>Are you sure you want to delete this user?</h3>

                <div className="modal-buttons">
                  <button
                    className="cancel-btn"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>

                  <button className="confirm-btn" onClick={confirmDelete}>
                    Yes, Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ManageUsers;
