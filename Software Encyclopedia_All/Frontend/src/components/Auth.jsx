import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

import "../CSS/AuthToggle.css";
import heroImage from "../assets/login_signup_i1.png";
import brandName from "../assets/only name.png";
import brandLogo from "../assets/only logo.png";
import { sendPasswordResetEmail } from "firebase/auth";

export default function Auth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleForgotPassword = async () => {
    if (!email) {
      setSubmitMessage("! PLEASE ENTER YOUR EMAIL FIRST");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setSubmitMessage("✅ PASSWORD RESET LINK SENT TO YOUR EMAIL");
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        setSubmitMessage("✖ EMAIL NOT REGISTERED");
      } else {
        setSubmitMessage(error.message);
      }
    }
  };

  // Reset on mode change
  useEffect(() => {
    setPassword("");
    setSubmitMessage("");
  }, [mode]);

  // 🔐 Password strength logic (unchanged)
  const getPasswordStrength = (pwd) => {
    const hasUpper = /[A-Z]/.test(pwd);
    const hasNumber = /\d/.test(pwd);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);

    if (pwd.length > 8 && hasUpper && hasNumber && hasSpecial) {
      return { strength: "strong", label: "Strong", hints: [] };
    } else if (pwd.length >= 6) {
      const hints = [];
      if (!hasUpper) hints.push("Add at least 1 capital letter");
      if (!hasNumber) hints.push("Add at least 1 number");
      if (!hasSpecial) hints.push("Add at least 1 special character");
      return { strength: "medium", label: "Medium", hints };
    } else if (pwd.length > 0) {
      const hints = [];
      if (pwd.length < 6)
        hints.push("Password should be at least 6 characters");
      if (!hasUpper) hints.push("Add at least 1 capital letter");
      if (!hasNumber) hints.push("Add at least 1 number");
      if (!hasSpecial) hints.push("Add at least 1 special character");
      return { strength: "weak", label: "Weak", hints };
    }
    return { strength: "", label: "", hints: [] };
  };

  const { strength, label, hints } = getPasswordStrength(password);

  const getAuthErrorMessage = (error) => {
    switch (error.code) {
      case "auth/email-already-in-use":
        return "⚠️ EMAIL ALREADY REGISTERED!";
      case "auth/invalid-email":
        return "✖ INVALID EMAIL FORMAT!";
      case "auth/weak-password":
        return "🔐 PASSWORD IS TOO WEAK!";
      case "auth/user-not-found":
        return "🚫 USER NOT FOUND!";
      case "auth/wrong-password":
        return "✖ INCORRECT PASSWORD!";
      default:
        return "⚠️ AUTHENTICATION FAILED!";
    }
  };

  // 🔗 Firebase submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (mode === "register") {
        if (strength !== "strong") {
          setSubmitMessage("Password not strong enough. " + hints.join(", "));
          return;
        }

        // 1️⃣ Create Firebase Auth user
        const userCred = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        // 2️⃣ Store user in Firestore
        await setDoc(doc(db, "users", userCred.user.uid), {
          username,
          email,
          createdAt: serverTimestamp(),
        });

        setSubmitMessage("Account created successfully!");
        setTimeout(() => setMode("login"), 1000);
      } else {
        const userCred = await signInWithEmailAndPassword(auth, email, password);

        const loggedInEmail = userCred.user.email;

        // 🔍 Check admin collection
        const adminRef = collection(db, "admin");
        const q = query(adminRef, where("email", "==", loggedInEmail));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          // ✅ Admin login
          navigate("/admin");
        } else {
          // ✅ Normal user login
          setSubmitMessage("Login successful!");
          setTimeout(() => {
      navigate("/home");
    }, 1200);
        }

      }
    } catch (error) {
      setSubmitMessage(getAuthErrorMessage(error));
    }
  };

  return (
    <div className="auth-page">
      {/* LEFT SIDE */}
      <div className="auth-left">
        <div className="left-content">
          <div className="brand-frame">
            <div className="left-brand">
              <img src={brandLogo} alt="Logo" className="left-logo-icon" />
              <img
                src={brandName}
                alt="Software Encyclopedia"
                className="left-logo-name"
              />
            </div>
          </div>

          <img
            src={heroImage}
            alt="Software Illustration"
            className="hero-img"
          />
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="auth-right">
        <div className="auth-card">
          <div className="card-brand">
            <img src={brandLogo} alt="Logo Icon" className="card-logo-icon" />
            <img
              src={brandName}
              alt="Software Encyclopedia"
              className="card-logo-name"
            />
          </div>

          {/* TOGGLE */}
          <div className="toggle">
            <span
              className={mode === "login" ? "active" : ""}
              onClick={() => setMode("login")}
            >
              Login
            </span>
            <span
              className={mode === "register" ? "active" : ""}
              onClick={() => setMode("register")}
            >
              Register
            </span>
            <div className={`slider ${mode}`} />
          </div>

          {/* FORM */}
          <form className="form" onSubmit={handleSubmit}>
            {mode === "register" && (
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            )}

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "👁️" : "🙈"}
              </span>
            </div>

            {mode === "register" && password && (
              <>
                <div className={`strength ${strength}`}>
                  <span />
                </div>
                <p className={`strength-text ${strength}`}>{label} password</p>
              </>
            )}

            {submitMessage && (
              <p className="submit-message error-strong">{submitMessage}</p>
            )}

            <button type="submit">
              {mode === "login" ? "LOGIN" : "CREATE ACCOUNT"}
            </button>
          </form>

          {mode === "login" && (
            <div className="forgot" onClick={handleForgotPassword}>
              Forgot Password?
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
