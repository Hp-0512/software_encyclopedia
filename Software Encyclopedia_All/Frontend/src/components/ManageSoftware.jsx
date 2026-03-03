import React, { useEffect, useState } from "react";
import axios from "axios";
import "../CSS/ManageSoftware.css";

const ManageSoftware = () => {
  const [categories, setCategories] = useState([]);
  const [softwares, setSoftwares] = useState([]);
  const [filteredSoftwares, setFilteredSoftwares] = useState([]);

  const [categoryId, setCategoryId] = useState("");
  const [categoryName, setCategoryName] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  const [deleteId, setDeleteId] = useState(null); // ✅ for custom delete popup

  const [formData, setFormData] = useState({
    SoftwareName: "",
    ShortDescription: "",
    Description: "",
    Version: "",
    LogoUrl: "",
    DownloadLink: "",
    OfficialWebsite: "",
  });
  const [errors, setErrors] = useState({});
  // ===== LOAD DATA =====
  useEffect(() => {
    axios
      .get("https://software-encyclopedia-2.onrender.com/api/categories")
      .then((res) => setCategories(res.data));
    fetchSoftwares();
  }, []);

  // ===== AUTO FILTER WHEN DATA CHANGES =====
  useEffect(() => {
    if (categoryId) {
      setFilteredSoftwares(
        softwares.filter((s) => s.CategoryID === categoryId),
      );
    } else {
      setFilteredSoftwares([]);
    }
  }, [softwares, categoryId]);

  const fetchSoftwares = () => {
    axios
      .get("https://software-encyclopedia-2.onrender.com/api/softwares")
      .then((res) => {
        setSoftwares(res.data);
      });
  };

  // ===== CATEGORY CHANGE =====
  const handleCategoryChange = (e) => {
    const id = e.target.value;
    const cat = categories.find((c) => c.id === id);

    setCategoryId(id);
    setCategoryName(cat?.Name || "");
    setFilteredSoftwares(softwares.filter((s) => s.CategoryID === id));
  };

  // ===== FORM CHANGE =====
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //=========Validations
  const validateForm = () => {
    const newErrors = {};
    const urlPattern = /^(https?:\/\/)[^\s$.?#].[^\s]*$/i;
    const versionPattern = /^[0-9]+(\.[0-9]+)*$/; // 1 or 1.0 or 1.0.2

    if (!formData.SoftwareName.trim()) {
      newErrors.SoftwareName = "Software name is required";
    }

    if (!formData.ShortDescription.trim()) {
      newErrors.ShortDescription = "Short description is required";
    }

    if (!formData.Description.trim()) {
      newErrors.Description = "Description is required";
    }

    if (!formData.Version.trim()) {
      newErrors.Version = "Version is required";
    } else if (!versionPattern.test(formData.Version)) {
      newErrors.Version = "Version format invalid (Example: 1.0.0)";
    }

    if (!formData.LogoUrl.trim()) {
      newErrors.LogoUrl = "Logo URL is required";
    } else if (!urlPattern.test(formData.LogoUrl)) {
      newErrors.LogoUrl = "Invalid URL format";
    } else if (!/\.(svg|png|jpg|jpeg)$/i.test(formData.LogoUrl)) {
      newErrors.LogoUrl = "Logo must be svg, png, jpg, or jpeg format";
    }

    if (!formData.DownloadLink.trim()) {
      newErrors.DownloadLink = "Download link is required";
    } else if (!urlPattern.test(formData.DownloadLink)) {
      newErrors.DownloadLink = "Invalid URL format";
    }

    if (!formData.OfficialWebsite.trim()) {
      newErrors.OfficialWebsite = "Website is required";
    } else if (!urlPattern.test(formData.OfficialWebsite)) {
      newErrors.OfficialWebsite = "Invalid URL format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ===== ADD / UPDATE =====
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return; // 🔥 stop if invalid

    const payload = {
      ...formData,
      CategoryID: categoryId,
      CategoryName: categoryName,
    };

    const request = isEdit
      ? axios.put(
          `https://software-encyclopedia-2.onrender.com/api/softwares/${editId}`,
          payload,
        )
      : axios.post(
          "https://software-encyclopedia-2.onrender.com/api/softwares",
          payload,
        );

    request.then(() => {
      fetchSoftwares();
      setShowModal(false);
      setIsEdit(false);
      setFormData({
        SoftwareName: "",
        ShortDescription: "",
        Description: "",
        Version: "",
        LogoUrl: "",
        DownloadLink: "",
        OfficialWebsite: "",
      });
    });
  };

  // ===== EDIT =====
  const handleEdit = (software) => {
    setIsEdit(true);
    setEditId(software.id);
    setFormData(software);
    setShowModal(true);
  };

  // ===== DELETE POPUP OPEN =====
  const handleDeleteClick = (id) => {
    setDeleteId(id);
  };

  // ===== CONFIRM DELETE =====
  const confirmDelete = () => {
    axios
      .delete(
        `https://software-encyclopedia-2.onrender.com/api/softwares/${deleteId}`,
      )
      .then(() => {
        fetchSoftwares();
        setDeleteId(null);
      });
  };

  return (
    <div className="manage-container">
      <div className="top-bar">
        <select
          className="category-select"
          onChange={handleCategoryChange}
          value={categoryId}
        >
          <option value="">-- Select Category --</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.Name}
            </option>
          ))}
        </select>

        {categoryId && (
          <button className="add-btn" onClick={() => setShowModal(true)}>
            ➕ Add Software
          </button>
        )}
      </div>

      <div className="table-wrapper">
        <table className="software-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Version</th>
              <th>Website</th>
              <th>Actions</th>
            </tr>
          </thead>
          {/* <tbody>
            {filteredSoftwares.map((s) => (
              <tr key={s.id}>
                <td>{s.SoftwareName}</td>
                <td>{s.Version}</td>
                <td>
                  <a
                    href={s.OfficialWebsite}
                    target="_blank"
                    rel="noreferrer"
                    className="visit-link"
                  >
                    Visit
                  </a>
                </td>
                <td className="action-buttons">
                  <button className="edit-btn" onClick={() => handleEdit(s)}>
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteClick(s.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody> */}
          <tbody>
            {categoryId === "" ? (
              <tr>
                <td colSpan="4" className="message-row">
                  Please select category
                </td>
              </tr>
            ) : filteredSoftwares.length === 0 ? (
              <tr>
                <td colSpan="4" className="message-row">
                  No software found
                </td>
              </tr>
            ) : (
              filteredSoftwares.map((s) => (
                <tr key={s.id}>
                  <td>{s.SoftwareName}</td>
                  <td>{s.Version}</td>
                  <td>
                    <a
                      href={s.OfficialWebsite}
                      target="_blank"
                      rel="noreferrer"
                      className="visit-link"
                    >
                      Visit
                    </a>
                  </td>
                  <td className="action-buttons">
                    <button className="edit-btn" onClick={() => handleEdit(s)}>
                      Edit ✏️
                    </button>

                    <button
                      className="deleted-btn"
                      onClick={() => handleDeleteClick(s.id)}
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

      {/* ===== ADD / EDIT MODAL ===== */}
      {showModal && (
        <div className="overlay">
          <div className="modal">
            <h3 className="modal-title">
              {isEdit ? "Update Software" : "Add Software"}
            </h3>
            <form className="software-form" onSubmit={handleSubmit}>
              <input
                name="SoftwareName"
                placeholder="Name"
                value={formData.SoftwareName}
                onChange={handleChange}
                required
              />
              {errors.SoftwareName && (
                <small style={{ color: "red" }}>{errors.SoftwareName}</small>
              )}
              <textarea
                name="ShortDescription"
                placeholder="Short Description"
                value={formData.ShortDescription}
                onChange={handleChange}
              />
              {errors.ShortDescription && (
                <small style={{ color: "red" }}>
                  {errors.ShortDescription}
                </small>
              )}

              <textarea
                name="Description"
                placeholder="Description"
                value={formData.Description}
                onChange={handleChange}
              />
              {errors.Description && (
                <small style={{ color: "red" }}>{errors.Description}</small>
              )}

              <input
                name="Version"
                placeholder="Version"
                value={formData.Version}
                onChange={handleChange}
              />
              {errors.Version && (
                <small style={{ color: "red" }}>{errors.Version}</small>
              )}

              <input
                name="LogoUrl"
                placeholder="Logo URL"
                value={formData.LogoUrl}
                onChange={handleChange}
              />
              {errors.LogoUrl && (
                <small style={{ color: "red" }}>{errors.LogoUrl}</small>
              )}

              <input
                name="DownloadLink"
                placeholder="Download Link"
                value={formData.DownloadLink}
                onChange={handleChange}
              />
              {errors.DownloadLink && (
                <small style={{ color: "red" }}>{errors.DownloadLink}</small>
              )}

              <input
                name="OfficialWebsite"
                placeholder="Website"
                value={formData.OfficialWebsite}
                onChange={handleChange}
              />
              {errors.OfficialWebsite && (
                <small style={{ color: "red" }}>{errors.OfficialWebsite}</small>
              )}

              <div className="form-buttons">
                <button type="submit" className="save-btn">
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== DELETE CONFIRM MODAL ===== */}
      {deleteId && (
        <div className="overlay">
          <div className="delete-modal" align="center">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this software?</p>
            <div className="delete-buttons">
              <button className="confirm-delete" onClick={confirmDelete}>
                Yes, Delete
              </button>

              <button
                className="cancel-delete"
                onClick={() => setDeleteId(null)}
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

export default ManageSoftware;
