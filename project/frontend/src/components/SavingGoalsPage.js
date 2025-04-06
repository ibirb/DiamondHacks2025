// frontend/src/components/SavingGoalsPage.js
import React, { useState, useEffect } from 'react';

function SavingGoalsPage({ userId }) {
  const [goalName, setGoalName] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [message, setMessage] = useState('');
  const [hasActiveGoal, setHasActiveGoal] = useState(false);
  const [activeGoal, setActiveGoal] = useState(null);
  const [daysRemaining, setDaysRemaining] = useState(0);

  const fetchActiveGoal = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/saving-goals/${userId}`);
      if (response.ok) {
        const data = await response.json();
        if (data) {
          setHasActiveGoal(true);
          setActiveGoal(data);
          // Calculate days remaining
          const today = new Date();
          const deadlineDate = new Date(data.startDate);
          deadlineDate.setDate(deadlineDate.getDate() + data.deadline);
          const timeDiff = deadlineDate.getTime() - today.getTime();
          const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
          setDaysRemaining(daysDiff > 0 ? daysDiff : 0);
        } else {
          setHasActiveGoal(false);
          setActiveGoal(null);
        }
      } else {
        setHasActiveGoal(false);
        setActiveGoal(null);
      }
    } catch (error) {
      console.error('Error fetching active goal:', error);
      setMessage('Error fetching active goal.');
    }
  };

  const updateAmountSaved = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/update-amount-saved/${userId}`);
      if (response.ok) {
        fetchActiveGoal();
      } else {
        setMessage('Failed to update amount saved.');
      }
    } catch (error) {
      setMessage('An error occurred.');
    }
  };

  useEffect(() => {
    fetchActiveGoal();
    updateAmountSaved();
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
        setHasActiveGoal(true);
        setActiveGoal(data);
        setDaysRemaining(data.deadline);
      } else {
        setMessage(data.error || 'Failed to create saving goal.');
      }
    } catch (error) {
      setMessage('An error occurred.');
    }
  };

  // Calculate progress percentage
  const progressPercentage = activeGoal
    ? Math.min((activeGoal.amountSaved / activeGoal.totalAmount) * 100, 100)
    : 0;

  return (
    <div>
      <h1>Saving Goals</h1>
      {hasActiveGoal && activeGoal ? (
        <div>
          <h2>{activeGoal.goalName}</h2>
          <div style={{ width: '100%', backgroundColor: '#e0e0e0', borderRadius: '5px' }}>
            <div
              style={{
                width: `${progressPercentage}%`,
                backgroundColor: '#4caf50',
                height: '20px',
                borderRadius: '5px',
                textAlign: 'center',
                color: 'white',
              }}
            >
              {progressPercentage.toFixed(0)}%
            </div>
          </div>
          <p>
            ${activeGoal.amountSaved} / ${activeGoal.totalAmount}
          </p>
          <p>{daysRemaining} days remaining</p>
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
