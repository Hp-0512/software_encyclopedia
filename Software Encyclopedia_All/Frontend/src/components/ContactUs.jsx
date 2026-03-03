import React, { useState, useRef } from "react";
import "../CSS/ContactUs.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { imagekit } from "../imagekit";
import wooden from "../assets/wooden.jpg";

const ContactUs = () => {
  const fileInputRef = useRef();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    consent: false,
    attachment: "", // ✅ NEW
  });

  const [status, setStatus] = useState({
    loading: false,
    success: "",
    error: "",
  });

  const [uploading, setUploading] = useState(false); // ✅ NEW

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  /* =============================
     IMAGE UPLOAD FUNCTION
  ============================= */
  const handleImageUpload = async (file) => {
    if (!file) return;

    setUploading(true);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onloadend = async () => {
        const base64 = reader.result.split(",")[1];

        const authRes = await fetch(
          "https://software-encyclopedia-2.onrender.com/auth",
        );
        const authData = await authRes.json();

        const result = await imagekit.upload({
          file: base64,
          fileName: `${Date.now()}_${file.name}`,
          folder: "/contact-attachments",
          publicKey: authData.publicKey,
          signature: authData.signature,
          token: authData.token,
          expire: authData.expire,
        });

        setFormData((prev) => ({
          ...prev,
          attachment: result.url, // ✅ store uploaded image URL
        }));

        setUploading(false);
      };
    } catch (error) {
      console.error("Upload Error:", error);
      setUploading(false);
    }
  };

  /* =============================
     SUBMIT
  ============================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.subject ||
      !formData.message
    ) {
      setStatus({
        loading: false,
        success: "",
        error: "All fields are required.",
      });
      return;
    }

    if (!formData.consent) {
      setStatus({
        loading: false,
        success: "",
        error: "You must agree to the Privacy Policy.",
      });
      return;
    }

    setStatus({ loading: true, success: "", error: "" });

    try {
      const response = await fetch("https://formspree.io/f/xwvblqly", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData), // ✅ includes attachment
      });

      if (!response.ok) throw new Error("Failed");

      setStatus({
        loading: false,
        success: "Your message has been sent successfully!",
        error: "",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        consent: false,
        attachment: "",
      });

      setTimeout(() => {
        setStatus({ loading: false, success: "", error: "" });
      }, 3000);
    } catch (error) {
      setStatus({
        loading: false,
        success: "",
        error: "Failed to send message. Please try again later.",
      });
    }
  };

  return (
    <>
      <Header />
      <div className="contact-container">
        <div className="contactdiv">
          <h1>Contact Us</h1>
          <p className="contact-subtitle">
            Have questions or suggestions? We'd love to hear from you.
          </p>
        </div>

        <div className="contact-wrapper">
          {/* Contact Form */}
          <form className="contact-form" onSubmit={handleSubmit}>
            {status.error && <div className="alert error">{status.error}</div>}
            {status.success && (
              <div className="alert success">{status.success}</div>
            )}

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
            />

            <input
              type="tel"
              name="phone"
              placeholder="Phone Number (optional)"
              value={formData.phone}
              onChange={handleChange}
            />

            <select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
            >
              <option value="">Select Subject</option>
              <option value="general">General Inquiry</option>
              <option value="software">Software Suggestion</option>
              <option value="bug">Bug Report</option>
              <option value="feedback">Feedback</option>
            </select>

            <textarea
              name="message"
              rows="5"
              placeholder="Write your message here..."
              value={formData.message}
              onChange={handleChange}
            />

            {/* ✅ ATTACHMENT SECTION */}
            <div className="attachment-section">
              <button
                type="button"
                className="attachment-btn"
                onClick={() => fileInputRef.current.click()}
              >
                📎 Attach Image
              </button>

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={(e) => handleImageUpload(e.target.files[0])}
              />

              {uploading && (
                <span className="uploading-text">Uploading...</span>
              )}

              {formData.attachment && (
                <div className="attachment-preview">
                  <img src={formData.attachment} alt="attachment" />
                </div>
              )}
            </div>

            <label className="consent">
              <input
                type="checkbox"
                name="consent"
                checked={formData.consent}
                onChange={handleChange}
              />
              <span>
                I agree to the <b>Privacy Policy</b>
              </span>
            </label>

            <button type="submit" disabled={status.loading}>
              {status.loading ? "Sending..." : "Send Message"}
            </button>
          </form>

          {/* ✅ CONTACT SIDE IMAGE + INFO */}
          <div className="contact-info">
            <div className="contact-image">
              <img src={wooden} alt="Contact Illustration" />
            </div>

            <h3>Reach Us</h3>
            <p>📧 mamointerns1234@gmail.com</p>
            <p>📞 +91 9876543210</p>
            <p>
              📍 MaMo TechnoLabs LLP Office No 27, RAAMA EMPERRO, 4th Floor,
              near Shell Petrol Pump, Vadodara, Gujarat 390011
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ContactUs;
