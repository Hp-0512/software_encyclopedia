import React from "react";
import "../CSS/Footer.css";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Brand Section */}
        <div className="footer-brand">
          <h2>Software Encyclopedia</h2>
          <p>
            A structured digital knowledge platform dedicated to providing
            verified insights, software comparisons, and intelligent discovery
            across industries.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li>
              <span onClick={() => navigate("/home")}>🏠 <u><b>Home</b></u></span>
            </li>
            <li>
              <span onClick={() => navigate("/aboutus")}>ℹ️ <u><b>About Us</b></u></span>
            </li>
            <li>
              <span onClick={() => navigate("/softwares")}>📂 <u><b>Categories</b></u></span>
            </li>
            <li>
              <span onClick={() => navigate("/contact")}>📞 <u><b>Contact</b></u></span>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-contact">
          <h3>Contact</h3>
          <p>📧Email:mamointerns1234@gmail.com</p>
          <p>📞 Mob No.:+91 9876543210</p>
          <p>📍Location: MaMo TechnoLabs LLP
Office No 27, RAAMA EMPERRO, 4th Floor, near Shell Petrol Pump, Vadodara, Gujarat 390011</p>
        </div>

      </div>

      {/* Bottom Strip */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Software Encyclopedia. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;