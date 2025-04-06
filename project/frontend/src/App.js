// frontend/src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import SavingGoalsPage from './components/SavingGoalsPage';
import DashboardPage from './components/DashboardPage';
import SignUpPage from './components/SignUpPage';
import ExpenseLogPage from './components/ExpenseLogPage'; // Import ExpenseLogPage
import ChatBotPage from './components/ChatBotPage'; // Import ChatBotPage
import SideNavBar from './components/SideNavBar'; // Import SideNavBar
import './App.css';

function ProtectedRoute({ isLoggedIn, children }) {
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }
  return children;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [isNavBarExpanded, setIsNavBarExpanded] = useState(false);

  const handleLogin = (userId) => {
    setIsLoggedIn(true);
    setLoggedInUserId(userId);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoggedInUserId(null);
  };

  const handleNavBarToggle = (isExpanded) => {
    setIsNavBarExpanded(isExpanded);
  };

  const contentMargin = isNavBarExpanded ? '200px' : '40px';

  return (
    <Router>
      <div className="app-container"> {/* Add a flex container */}
        {isLoggedIn && <SideNavBar onToggle={handleNavBarToggle} />} {/* Render SideNavBar if logged in */}
        <div className="content-container" style={{ marginLeft: contentMargin }}> {/* Content area */}
          <Routes>
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/" element={<LoginPage onLogin={handleLogin} />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <DashboardPage userId={loggedInUserId} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/saving-goals"
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <SavingGoalsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/expenses"
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <ExpenseLogPage userId={loggedInUserId} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chatbot"
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <ChatBotPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}



export default App;
