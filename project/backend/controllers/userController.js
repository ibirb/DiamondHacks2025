// frontend/src/components/DashboardPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import the calendar styles

ChartJS.register(ArcElement, Tooltip, Legend);

function DashboardPage({ userId }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dailyExpenses, setDailyExpenses] = useState([]);
  const [allExpenses, setAllExpenses] = useState([]);
  const [pieChartData, setPieChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
      },
    ],
  });
  const [showDailyExpenses, setShowDailyExpenses] = useState(false);
  const [dailySpendingGoal, setDailySpendingGoal] = useState(0);

  const fetchExpenses = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/expenses/${userId}`);
      const data = await response.json();
      console.log("Data from backend:", data);
      setAllExpenses(data || []);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const fetchUser = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/users/${userId}`);
      const data = await response.json();
      console.log("User data from backend:", data);
      setDailySpendingGoal(data.dailySpendingGoal || 0);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  useEffect(() => {
    fetchExpenses();
    fetchUser();
  }, [userId]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setShowDailyExpenses(true);
  };

  useEffect(() => {
    const formattedDate = selectedDate.toISOString().split('T')[0];
    const filteredExpenses = allExpenses.filter(
      (expense) => expense.date.substring(0, 10) === formattedDate
    );
    setDailyExpenses(filteredExpenses);
  }, [selectedDate, allExpenses]);

  useEffect(() => {
    // Calculate pie chart data for the current month
    const currentMonth = selectedDate.getMonth();
    const currentYear = selectedDate.getFullYear();

    const monthlyExpenses = allExpenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return (
        expenseDate.getMonth() === currentMonth &&
        expenseDate.getFullYear() === currentYear
      );
    });

    const categoryTotals = {};
    monthlyExpenses.forEach((expense) => {
      if (categoryTotals[expense.category]) {
        categoryTotals[expense.category] += expense.cost;
      } else {
        categoryTotals[expense.category] = expense.cost;
      }
    });

    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);
    const backgroundColor = [
      '#FF6384',
      '#36A2EB',
      '#FFCE56',
      '#4BC0C0',
      '#9966FF',
      '#FF9F40',
      '#C9CBCF',
    ];

    setPieChartData({
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: backgroundColor.slice(0, labels.length),
        },
      ],
    });
  }, [allExpenses, selectedDate]); // Re-calculate when allExpenses or selectedDate changes

  const getTileClassName = ({ date, view }) => {
    if (view === 'month') {
      const formattedDate = date.toISOString().split('T')[0];
      const dailyTotal = allExpenses.reduce((total, expense) => {
        if (expense.date.substring(0, 10) === formattedDate) {
          return total + expense.cost;
        }
        return total;
      }, 0);

      if (dailyTotal > dailySpendingGoal) {
        return 'over-budget';
      } else if (dailyTotal > dailySpendingGoal * 0.75) {
        return 'close-to-budget';
      } else {
        return 'within-budget';
      }
    }
  };

  return (
    <div>
      <h1>Dashboard Page</h1>
      <Link to="/expenses">Go to Expenses</Link>
      <div style={{ display: 'flex', gap: '20px' }}>
        {/* Pie Chart */}
        <div style={{ width: '400px' }}>
          <h2>Spending Breakdown</h2>
          <Pie data={pieChartData} />
        </div>

        {/* Calendar */}
        <div>
          <h2>Select a Date</h2>
          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            locale="en-US"
            tileClassName={getTileClassName} // Add the tileClassName prop
          />
        </div>
      </div>

      {/* Daily Expenses */}
      {showDailyExpenses && (
        <div>
          <h2>Expenses for {selectedDate.toLocaleDateString()}</h2>
          <ul>
            {dailyExpenses.map((expense) => (
              <li key={expense._id}>
                {expense.category}: {expense.name} - ${expense.cost}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
