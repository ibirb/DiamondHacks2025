// frontend/src/components/SignUpPage.js
import React, { useState } from 'react';

function SignUpPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [dailySpendingGoal, setDailySpendingGoal] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent page refresh

    try {
      const response = await fetch('http://localhost:3001/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, name, dailySpendingGoal }), // Send new fields
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('User created successfully!');
        setUsername('');
        setPassword('');
        setName('');
        setDailySpendingGoal('');
      } else {
        setMessage(data.error || 'Failed to create user.');
      }
    } catch (error) {
      setMessage('An error occurred.');
    }
  };

  return (
    <div>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="dailySpendingGoal">Daily Spending Goal:</label>
          <input
            type="number"
            id="dailySpendingGoal"
            value={dailySpendingGoal}
            onChange={(e) => setDailySpendingGoal(e.target.value)}
            required
          />
        </div>
        <button type="submit">Sign Up</button>
      </form>
      {message && <div>{message}</div>}
    </div>
  );
}

export default SignUpPage;
