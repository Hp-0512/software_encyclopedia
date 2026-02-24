import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Auth from "./components/Auth";
import Home from "./components/Home";
import AdminProfile from "./components/AdminProfile";
import AdminHome from "./components/AdminHome";
import Dashboard from "./components/AdminDashboard";
import ManageUsers from "./components/ManageUsers";
import ManageCategories from "./components/ManageCategories";
import ManageSoftware from "./components/ManageSoftware";
import ManageCommunity from "./components/ManageCommunity";
import Softwares from "./components/Softwares";
import ContactUs from "./components/ContactUs";
import Feedback from "./components/Feedback";
import AIChatbot from "./components/AIChatbot";
import ManageReviews from "./components/Managereviews";
import ManageQuiz from "./components/ManageQuiz";
import SavedCollection from "./components/SavedCollection";
import Quiz from "./components/Quiz";
import TechNews from "./components/TechNews";
import GroupChat from "./components/GroupChat";
import Community from "./components/Community";
import QuizAnalytics from "./components/QuizAnalytics";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* AUTH */}
        <Route path="/" element={<Auth />} />

        {/* USER HOME */}
        <Route
          path="/home"
          element={
            <>
              <Home />
              <AIChatbot />
            </>
          }
        />

        {/* SOFTWARE LIST */}
        <Route
          path="/softwares"
          element={
            <>
              <Softwares />
              <AIChatbot />
            </>
          }
        />

        <Route path="/community" element={<Community />} />
        <Route path="/community/:categoryId" element={<GroupChat />} />

        {/* SAVED COLLECTION */}
        <Route
          path="/collection"
          element={
            <>
              <SavedCollection />
              <AIChatbot />
            </>
          }
        />
        <Route
          path="/tech-news"
          element={
            <>
              <TechNews />
              <AIChatbot />
            </>
          }
        />
        <Route
          path="/quiz"
          element={
            <>
              <Quiz />
              {/* <AIChatbot /> */}
            </>
          }
        />
        <Route
          path="/quiz-analytics"
          element={
            <>
              <QuizAnalytics />
              <AIChatbot />
            </>
          }
        />

        {/* CONTACT */}
        <Route
          path="/contact"
          element={
            <>
              <ContactUs />
              <AIChatbot />
            </>
          }
        />

        {/* FEEDBACK */}
        <Route
          path="/feedback"
          element={
            <>
              <Feedback />
              <AIChatbot />
            </>
          }
        />

        {/* ADMIN */}
        <Route path="/admin" element={<AdminHome />}>
          <Route index element={<Dashboard />} />
          <Route path="adminprofile" element={<AdminProfile />} />
          <Route path="manage-users" element={<ManageUsers />} />
          <Route path="manage-categories" element={<ManageCategories />} />
          <Route path="manage-softwares" element={<ManageSoftware />} />
          <Route path="managereviews" element={<ManageReviews />} />
          <Route path="community" element={<ManageCommunity />} />
          <Route path="manageresult" element={<ManageQuiz />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
