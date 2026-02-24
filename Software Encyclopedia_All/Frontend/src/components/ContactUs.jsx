// import React, { useState } from "react";
// import "../CSS/ContactUs.css";

// const ContactUs = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     subject: "",
//     message: "",    
//     consent: false,
//   });

//   const [status, setStatus] = useState({
//     loading: false,
//     success: "",
//     error: "",
//   });

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData({
//       ...formData,
//       [name]: type === "checkbox" ? checked : value,
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     // Basic validation
//     if (
//       !formData.name ||
//       !formData.email ||
//       !formData.subject ||
//       !formData.message
//     ) {
//       setStatus({ loading: false, success: "", error: "All fields are required." });
//       return;
//     }

//     if (!formData.consent) {
//       setStatus({
//         loading: false,
//         success: "",
//         error: "You must agree to the privacy policy.",
//       });
//       return;
//     }

//     setStatus({ loading: true, success: "", error: "" });

//     // Simulated API call (replace with Firebase / backend later)
//     setTimeout(() => {
//       setStatus({
//         loading: false,
//         success: "Your message has been sent successfully!",
//         error: "",
//       });

//       setFormData({
//         name: "",
//         email: "",
//         phone: "",
//         subject: "",
//         message: "",
//         consent: false,
//       });
//     }, 1500);
//   };

//   return (
//     <div className="contact-container">
//       <h1>Contact Us</h1>
//       <p className="contact-subtitle">
//         Have questions or suggestions? We'd love to hear from you.
//       </p>

//       <div className="contact-wrapper">
//         {/* Contact Form */}
//         <form className="contact-form" onSubmit={handleSubmit}>
//           {status.error && <div className="alert error">{status.error}</div>}
//           {status.success && <div className="alert success">{status.success}</div>}

//           <input
//             type="text"
//             name="name"
//             placeholder="Full Name"
//             value={formData.name}
//             onChange={handleChange}
//           />

//           <input
//             type="email"
//             name="email"
//             placeholder="Email Address"
//             value={formData.email}
//             onChange={handleChange}
//           />

//           <input
//             type="tel"
//             name="phone"
//             placeholder="Phone Number (optional)"
//             value={formData.phone}
//             onChange={handleChange}
//           />

//           <select
//             name="subject"
//             value={formData.subject}
//             onChange={handleChange}
//           >
//             <option value="">Select Subject</option>
//             <option value="general">General Inquiry</option>
//             <option value="software">Software Suggestion</option>
//             <option value="bug">Bug Report</option>
//             <option value="feedback">Feedback</option>
//           </select>

//           <textarea
//             name="message"
//             rows="5"
//             placeholder="Write your message here..."
//             value={formData.message}
//             onChange={handleChange}
//           />

//           <label className="consent">
//             <input
//               type="checkbox"
//               name="consent"
//               checked={formData.consent}
//               onChange={handleChange}
//             />
//             <p><b>I agree to the Privacy Policy</b></p>
//           </label>

//           <button type="submit" disabled={status.loading}>
//             {status.loading ? "Sending..." : "Send Message"}
//           </button>
//         </form>

//         {/* Contact Information */}
//         <div className="contact-info">
//           <h3>Reach Us</h3>
//           <p>📧 support@softwareencyclopedia.com</p>
//           <p>📞 +91 98765 43210</p>
//           <p>📍 India</p>

//           <div className="social-links">
//             <a href="#">LinkedIn</a>
//             <a href="#">GitHub</a>
//             <a href="#">Twitter</a>
//           </div>

//           <iframe
//             title="Google Map"
//             src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8354345093893!2d144.95373531550454!3d-37.81627974202156"
//             loading="lazy"
//             referrerPolicy="no-referrer-when-downgrade"
//           ></iframe>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ContactUs;


// import React, { useState } from "react";
// import "../CSS/ContactUs.css";

// const ContactUs = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     subject: "",
//     message: "",
//     consent: false,
//   });

//   const [status, setStatus] = useState({
//     loading: false,
//     success: "",
//     error: "",
//   });

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData({
//       ...formData,
//       [name]: type === "checkbox" ? checked : value,
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (!formData.name || !formData.email || !formData.subject || !formData.message) {
//       setStatus({ loading: false, success: "", error: "All fields are required." });
//       return;
//     }

//     if (!formData.consent) {
//       setStatus({ loading: false, success: "", error: "You must agree to the Privacy Policy." });
//       return;
//     }

//     setStatus({ loading: true, success: "", error: "" });

//     setTimeout(() => {
//       setStatus({
//         loading: false,
//         success: "Your message has been sent successfully!",
//         error: "",
//       });

//       setFormData({
//         name: "",
//         email: "",
//         phone: "",
//         subject: "",
//         message: "",
//         consent: false,
//       });
//     }, 1500);
//   };

//   return (
//     <div className="contact-container">
//         <div className="contactdiv">
//             <h1>Contact Us</h1>
//       <p className="contact-subtitle">
//         Have questions or suggestions? We'd love to hear from you.
//       </p>
//         </div>
      

//       <div className="contact-wrapper">
//         {/* Contact Form */}
//         <form className="contact-form" onSubmit={handleSubmit}>
//           {status.error && <div className="alert error">{status.error}</div>}
//           {status.success && <div className="alert success">{status.success}</div>}

//           <input
//             type="text"
//             name="name"
//             placeholder="Full Name"
//             value={formData.name}
//             onChange={handleChange}
//           />

//           <input
//             type="email"
//             name="email"
//             placeholder="Email Address"
//             value={formData.email}
//             onChange={handleChange}
//           />

//           <input
//             type="tel"
//             name="phone"
//             placeholder="Phone Number (optional)"
//             value={formData.phone}
//             onChange={handleChange}
//           />

//           <select
//             name="subject"
//             value={formData.subject}
//             onChange={handleChange}
//           >
//             <option value="">Select Subject</option>
//             <option value="general">General Inquiry</option>
//             <option value="software">Software Suggestion</option>
//             <option value="bug">Bug Report</option>
//             <option value="feedback">Feedback</option>
//           </select>

//           <textarea
//             name="message"
//             rows="5"
//             placeholder="Write your message here..."
//             value={formData.message}
//             onChange={handleChange}
//           />

//           {/* FIXED CHECKBOX */}
//           <label className="consent">
//             <input
//               type="checkbox"
//               name="consent"
//               checked={formData.consent}
//               onChange={handleChange}
//             />
//             <span>
//               I agree to the <b>Privacy Policy</b>
//             </span>
//           </label>

//           <button type="submit" disabled={status.loading}>
//             {status.loading ? "Sending..." : "Send Message"}
//           </button>
//         </form>

//         {/* Contact Info */}
//         <div className="contact-info">
//           <h3>Reach Us</h3>
//           <p>📧 support@softwareencyclopedia.com</p>
//           <p>📞 +91 98765 43210</p>
//           <p>📍 India</p>

//           <div className="social-links">
//             <a href="#">LinkedIn</a>
//             <a href="#">GitHub</a>
//             <a href="#">Twitter</a>
//           </div>

//           <iframe
//             title="Google Map"
//             src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8354345093893!2d144.95373531550454!3d-37.81627974202156"
//             loading="lazy"
//             referrerPolicy="no-referrer-when-downgrade"
//           ></iframe>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ContactUs;


import React, { useState } from "react";
import "../CSS/ContactUs.css";
import Header from "../components/Header";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    consent: false,
  });

  const [status, setStatus] = useState({
    loading: false,
    success: "",
    error: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setStatus({ loading: false, success: "", error: "All fields are required." });
      return;
    }

    if (!formData.consent) {
      setStatus({ loading: false, success: "", error: "You must agree to the Privacy Policy." });
      return;
    }

    setStatus({ loading: true, success: "", error: "" });

    try {
      const response = await fetch(
        "https://formspree.io/f/xwvblqly", // 🔴 REPLACE THIS
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            subject: formData.subject,
            message: formData.message,
          }),
        }
      );

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
          {status.success && <div className="alert success">{status.success}</div>}

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

          <select name="subject" value={formData.subject} onChange={handleChange}>
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

          <label className="consent">
            <input
              type="checkbox"
              name="consent"
              checked={formData.consent}
              onChange={handleChange}
            />
            <span>I agree to the <b>Privacy Policy</b></span>
          </label>

          <button type="submit" disabled={status.loading}>
            {status.loading ? "Sending..." : "Send Message"}
          </button>
        </form>

        {/* Contact Info */}
        <div className="contact-info">
          <h3>Reach Us</h3>
          <p>📧 support@softwareencyclopedia.com</p>
          <p>📞 +91 98765 43210</p>
          <p>📍 India</p>
        </div>
      </div>
    </div></>
  );
};

export default ContactUs;
