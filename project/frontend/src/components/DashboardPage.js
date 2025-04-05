// frontend/src/components/DashboardPage.js
import React from 'react';
import { Link } from 'react-router-dom';

function DashboardPage() {
  return (
    <div>
      <h1>Dashboard Page</h1>
      <Link to="/expenses">Go to Expenses</Link>
      {/* Add your dashboard content here */}
    </div>
  );
}

export default DashboardPage;
