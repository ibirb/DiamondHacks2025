// frontend/src/components/SavingGoalsPage.js
import React, { useState, useEffect } from 'react';

function SavingGoalsPage({ userId }) {
  const [goalName, setGoalName] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [message, setMessage] = useState('');
  const [hasActiveGoal, setHasActiveGoal] = useState(false);

  useEffect(() => {
    const fetchActiveGoal = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/saving-goals/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setHasActiveGoal(!!data); // If data exists, an active goal exists
        } else {
          setHasActiveGoal(false);
        }
      } catch (error) {
        console.error('Error fetching active goal:', error);
        setMessage('Error fetching active goal.');
      }
    };

    fetchActiveGoal();
  }, [userId]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/api/saving-goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, goalName, totalAmount, deadline }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Saving goal created successfully!');
        setGoalName('');
        setTotalAmount('');
        setDeadline('');
        setHasActiveGoal(true); // Update state to show progress meter
      } else {
        setMessage(data.error || 'Failed to create saving goal.');
      }
    } catch (error) {
      setMessage('An error occurred.');
    }
  };

  return (
    <div>
      <h1>Saving Goals</h1>
      {hasActiveGoal ? (
        <div>
          {/* Placeholder for progress meter - will implement later */}
          <p>Progress meter will go here</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="goalName">What are you saving towards?</label>
            <input
              type="text"
              id="goalName"
              value={goalName}
              onChange={(e) => setGoalName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="totalAmount">Total amount to save:</label>
            <input
              type="number"
              id="totalAmount"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="deadline">Deadline (in days):</label>
            <input
              type="number"
              id="deadline"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
            />
          </div>
          <button type="submit">Create Saving Goal</button>
        </form>
      )}
      {message && <div>{message}</div>}
    </div>
  );
}

export default SavingGoalsPage;
