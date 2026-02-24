import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs
} from "firebase/firestore";
import "../CSS/QuizAnalytics.css";
import Header from "./Header";

const QuizAnalytics = () => {
  const user = auth.currentUser;
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchResults = async () => {
      setLoading(true);

      try {
        const q = query(
          collection(db, "quizResults"),
          where("userId", "==", user.uid)
        );

        const snapshot = await getDocs(q);

        console.log("🔥 Raw Firestore Data:");
        snapshot.forEach((doc) => {
          console.log(doc.data());
        });

        const data = snapshot.docs.map((doc) => {
          const d = doc.data();

          let date = "N/A";
          let time = "N/A";

          if (d.createdAt && typeof d.createdAt.toDate === "function") {
            const dateObj = d.createdAt.toDate();
            date = dateObj.toLocaleDateString();
            time = dateObj.toLocaleTimeString();
          }

          return {
            id: doc.id,
            username: d.username || "N/A",
            email: d.email || "N/A",
            categoryName: d.categoryName || "N/A",
            score: d.score ?? 0,
            totalQuestions: d.totalQuestions ?? 0,
            percentage:
              d.percentage ??
              (
                d.totalQuestions > 0
                  ? ((d.score / d.totalQuestions) * 100).toFixed(1)
                  : 0
              ),
            date,
            time
          };
        });

        // Sort newest first manually
        data.sort((a, b) => new Date(b.date + " " + b.time) - new Date(a.date + " " + a.time));

        setResults(data);
      } catch (error) {
        console.error("❌ Error fetching quiz results:", error);
      }

      setLoading(false);
    };

    fetchResults();
  }, [user]);

  return (
    <>
    <Header/>
    <div className="quiz-analytics-container">
      <h2>📊 Quiz Performance</h2>

      {loading ? (
        <div className="quiz-loading">Loading results...</div>
      ) : results.length === 0 ? (
        <div className="no-results">No quiz attempts yet.</div>
      ) : (
        <div className="table-wrapper">
          <table className="quiz-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Username</th>
                <th>Email</th>
                <th>Category</th>
                <th>Score</th>
                <th>Total Questions</th>
                <th>Percentage</th>
                <th>Date</th>
                <th>Time</th>
              </tr>
            </thead>

            <tbody>
              {results.map((result, index) => (
                <tr key={result.id}>
                  <td>{index + 1}</td>
                  <td>{result.username}</td>
                  <td>{result.email}</td>
                  <td>{result.categoryName}</td>
                  <td>{result.score}</td>
                  <td>{result.totalQuestions}</td>
                  <td className="percentage">
                    {result.percentage}%
                  </td>
                  <td>{result.date}</td>
                  <td>{result.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
    </>
  );
};

export default QuizAnalytics;
