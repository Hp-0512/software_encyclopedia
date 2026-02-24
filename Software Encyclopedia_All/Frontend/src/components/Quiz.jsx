import React, { useEffect, useState } from "react";
import axios from "axios";
import { auth, db } from "../firebase";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  addDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Confetti from "react-confetti";
import Header from "./Header";
import "../CSS/Quiz.css";

const Quiz = () => {
  const [userAnswers, setUserAnswers] = useState([]);
  const [showReview, setShowReview] = useState(false);

  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);

  const [username, setUsername] = useState("");
  const [percentage, setPercentage] = useState(0);

  // ✅ Fetch Logged In Username
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setUsername(userSnap.data().username);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // ✅ Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      const snap = await getDocs(collection(db, "Categories"));
      setCategories(
        snap.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().Name,
        })),
      );
    };
    fetchCategories();
  }, []);

  // ✅ Timer Logic
  useEffect(() => {
    if (!quizStarted || submitted) return;

    if (timeLeft === 0 && selectedAnswer === null) {
      handleNext();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, quizStarted, submitted]);

  // ✅ Start Quiz
  const startQuiz = async (category) => {
    setLoading(true);
    setQuizStarted(true);
    setSelectedCategory(category);
    setQuestions([]);
    setScore(0);
    setSubmitted(false);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setTimeLeft(35);

    const q = query(
      collection(db, "Softwares"),
      where("CategoryID", "==", category.id),
    );

    const snap = await getDocs(q);

    const softwares = snap.docs.map((doc) => ({
      name: doc.data().SoftwareName,
      description: doc.data().ShortDescription,
    }));

    const res = await axios.post(
      "http://software-encyclopedia-1.onrender.com/api/quiz/generate-quiz",
      { categoryName: category.name, softwares },
    );

    setQuestions(res.data);
    setLoading(false);
  };

  // ✅ Next Question
  // const handleNext = () => {
  //   if (selectedAnswer === questions[currentQuestion]?.correctAnswer) {
  //     setScore((prev) => prev + 1);
  //   }

  //   if (currentQuestion + 1 < questions.length) {
  //     setCurrentQuestion((prev) => prev + 1);
  //     setSelectedAnswer(null);
  //     setTimeLeft(40);
  //   } else {
  //     handleFinishQuiz(); // 🔥 important
  //   }
  // };

  // const handleNext = () => {
  //   let updatedScore = score;

  //   if (selectedAnswer === questions[currentQuestion]?.correctAnswer) {
  //     updatedScore = score + 1;
  //     setScore(updatedScore);
  //   }

  //   if (currentQuestion + 1 < questions.length) {
  //     setCurrentQuestion((prev) => prev + 1);
  //     setSelectedAnswer(null);
  //     setTimeLeft(30);
  //   } else {
  //     handleFinishQuiz(updatedScore); // ✅ pass correct value
  //   }
  // };

  const handleNext = () => {
    let updatedScore = score;

    const correctIndex = questions[currentQuestion]?.correctAnswer;
    const isCorrect = selectedAnswer === correctIndex;

    if (isCorrect) {
      updatedScore = score + 1;
      setScore(updatedScore);
    }

    // ✅ Store answer record
    const answerRecord = {
      question: questions[currentQuestion]?.question,
      options: questions[currentQuestion]?.options,
      selectedAnswer,
      correctAnswer: correctIndex,
      isCorrect,
    };

    setUserAnswers((prev) => [...prev, answerRecord]);

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
      setTimeLeft(30);
    } else {
      handleFinishQuiz(updatedScore);
    }
  };

  // ✅ Finish Quiz + Save to Firestore
  // const handleFinishQuiz = async () => {
  //   const percent = Math.round((score / questions.length) * 100);
  //   setPercentage(percent);
  //   setSubmitted(true);

  //   const user = auth.currentUser;

  //   if (user) {
  //     await addDoc(collection(db, "quizResults"), {
  //       userId: user.uid,
  //       username: username,
  //       email: user.email,
  //       categoryId: selectedCategory?.id || "",
  //       score: score,
  //       totalQuestions: questions.length,
  //       percentage: percent,
  //       createdAt: new Date(),
  //     });
  //   }
  // };

  const handleFinishQuiz = async (finalScore) => {
    const percent = Math.round((finalScore / questions.length) * 100);
    setPercentage(percent);
    setSubmitted(true);

    const user = auth.currentUser;

    if (user) {
      await addDoc(collection(db, "quizResults"), {
        userId: user.uid,
        username: username,
        email: user.email,
        categoryId: selectedCategory?.id || "",
        categoryName: selectedCategory?.name || "",
        score: finalScore, // ✅ use finalScore
        totalQuestions: questions.length,
        percentage: percent,
        createdAt: new Date(),
      });
    }
  };

  const performanceMessage = () => {
    if (percentage >= 80) return "Excellent Performance 🚀";
    if (percentage >= 50) return "Good Job 👍";
    return "Needs Improvement 💪";
  };

  const handleRestart = () => {
    setQuizStarted(false);
    setQuestions([]);
    setSubmitted(false);
  };

  return (
    <>
      <Header />

      <div className="quiz-fullscreen">
        {/* CATEGORY SCREEN */}
        {!quizStarted && (
          <div className="category-screen">
            <h1>Select Quiz Category</h1>

            <div className="category-grid">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="category-card"
                  onClick={() => startQuiz(cat)}
                >
                  {cat.name}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* QUIZ SCREEN */}
        {quizStarted && (
          <div className="quiz-screen">
            {loading && (
              <div className="loader-center">
                <span className="spinner"></span>
              </div>
            )}

            {!loading && !submitted && questions.length > 0 && (
              <>
                {/* Progress */}
                <div className="progress-wrapper">
                  <div
                    className="progress-bar"
                    style={{
                      width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                    }}
                  ></div>
                </div>

                {/* Timer */}
                <div className="timer">⏳ {timeLeft}s</div>

                <div className="question-card">
                  <h3>
                    Question {currentQuestion + 1} of {questions.length}
                  </h3>

                  <h2>{questions[currentQuestion]?.question}</h2>

                  <div className="options">
                    {questions[currentQuestion]?.options.map((opt, i) => (
                      <div
                        key={i}
                        className={`option-btn ${
                          selectedAnswer === i ? "selected" : ""
                        }`}
                        onClick={() => setSelectedAnswer(i)}
                      >
                        {opt}
                      </div>
                    ))}
                  </div>

                  <button
                    className="next-btn"
                    onClick={() => {
                      if (!submitted) handleNext();
                    }}
                    disabled={selectedAnswer === null}
                  >
                    {currentQuestion + 1 === questions.length
                      ? "Finish Quiz"
                      : "Next"}
                  </button>
                </div>
              </>
            )}

            {/* RESULT SCREEN */}
            {submitted && (
              <div className="result-fullscreen">
                <Confetti
                  width={window.innerWidth}
                  height={window.innerHeight}
                />

                <div className="result-content">
                  <h1 className="result-title">
                    🎉 Congratulations {username}
                  </h1>

                  <p className="performance-text">{performanceMessage()}</p>

                  <div className="result-score-line">
                    Your Score = {score}/{questions.length} • {percentage}%
                  </div>

                  <div className="result-buttons">
                    <button
                      className="review-btn"
                      onClick={() => setShowReview(true)}
                    >
                      Review Answers
                    </button>

                    <button
                      className="back-category-btn"
                      onClick={handleRestart}
                    >
                      Back to Categories
                    </button>
                  </div>
                  {/* REVIEW MODAL */}
                  {showReview && (
                    <div className="review-overlay">
                      <div className="review-modal">
                        <h2>Answer Review</h2>

                        <div className="review-list">
                          {userAnswers.map((ans, index) => (
                            <div key={index} className="review-card">
                              <h4>
                                Q{index + 1}. {ans.question}
                              </h4>

                              <div className="review-options">
                                {ans.options.map((opt, i) => {
                                  const isCorrect = i === ans.correctAnswer;
                                  const isSelected = i === ans.selectedAnswer;

                                  return (
                                    <div
                                      key={i}
                                      className={`review-option 
                                        ${isCorrect ? "correct" : ""}
                                        ${isSelected && !isCorrect ? "incorrect" : ""}
                                      `}
                                    >
                                      {opt}

                                      {isCorrect && <span> ✅ Correct</span>}
                                      {isSelected && !isCorrect && (
                                        <span> ❌ Your Answer</span>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>

                        <button
                          className="close-review-btn"
                          onClick={() => setShowReview(false)}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Quiz;
