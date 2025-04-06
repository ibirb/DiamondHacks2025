// frontend/src/components/ExpenseLogPage.js
import React, { useState, useEffect } from 'react';
import './ExpenseLogPage.css';


function ExpenseLogPage({ userId }) { // Accept userId as a prop
    const [expenses, setExpenses] = useState([]);
    const [category, setCategory] = useState('');
    const [name, setName] = useState('');
    const [cost, setCost] = useState('');
    const [date, setDate] = useState('');
    const [message, setMessage] = useState('');

    // Define the available categories
    const categories = [
        'Food',
        'Transportation',
        'Entertainment',
        'Utilities',
        'Housing',
        'Healthcare',
        'Shopping',
        'Miscellaneous',
    ];

    const fetchExpenses = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/expenses/${userId}`); // Use the userId prop
            const data = await response.json();
            console.log("Data from backend:", data);
            setExpenses(data || []);
        } catch (error) {
            console.error('Error fetching expenses:', error);
            setMessage('Error fetching expenses.');
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, [userId]); // Re-fetch when userId changes

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('http://localhost:3001/api/expenses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user: userId, category, name, cost, date }), // Use the userId prop
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Expense added successfully!');
                setCategory('');
                setName('');
                setCost('');
                setDate('');
                fetchExpenses(); // Refresh the expense list
            } else {
                setMessage(data.error || 'Failed to add expense.');
            }
        } catch (error) {
            setMessage('An error occurred.');
        }
    };

    return (
        <div className="container">
        <div className="split1">
            <h1>Expense Log</h1>

            {/* Expense Form */}
            <form onSubmit={handleSubmit}>
                <div>
                    <div className="form-group">
                    <label htmlFor="category">Category:</label>
                    </div>
                    <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    >
                        <option value="">Select a category</option> {/* Default option */}
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                </div>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                <div className="form-group">
                    <label htmlFor="cost">Cost:</label>
                </div>
                    <input
                        type="number"
                        id="cost"
                        value={cost}
                        onChange={(e) => setCost(e.target.value)}
                        required
                    />
                </div>
                <div>
                <div className="form-group">
                    <label htmlFor="date">Date:</label>
                </div>
                    <input
                        type="date"
                        id="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>
                <button type="submit" className="add-expense-button">Add Expense</button>
            </form>
            {message && <div>{message}</div>}
        </div>
        <div className="split2">
        {/* Expense List */}
        <h2>Expenses</h2>
        <div className="expense-table-container">
          <table>
            <thead>
              <tr>
                <th className="date-column">Date</th>
                <th className="category-column">Category</th>
                <th className="name-column">Name</th>
                <th className="cost-column">Cost</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense._id}>
                  <td className="date-column">{expense.date.substring(0, 10)}</td>
                  <td className="category-column">{expense.category}</td>
                  <td className="name-column">{expense.name}</td>
                  <td className="cost-column">${expense.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
        </div>
    );
}

export default ExpenseLogPage;
