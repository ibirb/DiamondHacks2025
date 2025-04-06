// frontend/src/components/DashboardPage.js
import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import the calendar styles
import './DashboardPage.css'; // Import the new CSS file

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
  const [calendarViewDate, setCalendarViewDate] = useState(new Date()); // New state variable

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

  const handleCalendarViewChange = ({ activeStartDate }) => {
    setCalendarViewDate(activeStartDate);
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
    const currentMonth = calendarViewDate.getMonth(); // Use calendarViewDate
    const currentYear = calendarViewDate.getFullYear(); // Use calendarViewDate

    const monthlyExpenses = allExpenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return (
        expenseDate.getUTCMonth() === currentMonth &&
        expenseDate.getUTCFullYear() === currentYear
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
  }, [allExpenses, calendarViewDate]); // Re-calculate when allExpenses or calendarViewDate changes

  const getTileClassName = ({ date, view }) => {
    if (view === 'month') {
      return 'react-calendar__tile'; // Always return the default class
    }
  };

  const getTileContent = ({ date, view }) => {
    if (view === 'month') {
      const formattedDate = date.toISOString().split('T')[0];
      const dailyTotal = allExpenses.reduce((total, expense) => {
        if (expense.date.substring(0, 10) === formattedDate) {
          return total + expense.cost;
        }
        return total;
      }, 0);

      let className = '';
      if (dailyTotal > dailySpendingGoal) {
        className = 'over-budget';
      } else if (dailyTotal > dailySpendingGoal * 0.75) {
        className = 'close-to-budget';
      } else {
        className = 'within-budget';
      }

      return (
        <div className={`react-calendar__tile__date ${className}`}>
          {date.getDate()}
        </div>
      );
    }
    return null;
  };

    // Calculate total daily spending
    const totalDailySpending = dailyExpenses.reduce(
        (total, expense) => total + expense.cost,
        0
    );

    useEffect(() => {
      // Set calendarViewDate to the current date when the component mounts
      setCalendarViewDate(new Date());
    }, []);

  return (
    <div>
      <h1>Dashboard Page</h1>
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
            tileClassName={getTileClassName}
            tileContent={getTileContent}
            onActiveStartDateChange={handleCalendarViewChange} // Add this line
          />
        </div>
      </div>

      {/* Daily Expenses */}
      {showDailyExpenses && (
        <div>
          <h2 className="black-text">
            Expenses for {selectedDate.toLocaleDateString()} - Total: ${totalDailySpending.toFixed(2)}
          </h2>
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
