// frontend/src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import FinancePage from './components/FinancePage';
import DashboardPage from './components/DashboardPage';
import SignUpPage from './components/SignUpPage';
import ExpenseLogPage from './components/ExpenseLogPage'; // Import ExpenseLogPage


function ProtectedRoute({ isLoggedIn, children }) {
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }
  return children;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUserId, setLoggedInUserId] = useState(null); 

  const handleLogin = (userId) => { // Update handleLogin to accept userId
    setIsLoggedIn(true);
    setLoggedInUserId(userId); // Set the loggedInUserId
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoggedInUserId(null);
  };

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/" element={<LoginPage onLogin={handleLogin} />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/finance"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <FinancePage />
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
