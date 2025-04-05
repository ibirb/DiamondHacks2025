// frontend/src/components/ExpenseLogPage.js
import React, { useState, useEffect } from 'react';

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
        <div>
            <h1>Expense Log</h1>

            {/* Expense Form */}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="category">Category:</label>
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
                    <label htmlFor="cost">Cost:</label>
                    <input
                        type="number"
                        id="cost"
                        value={cost}
                        onChange={(e) => setCost(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="date">Date:</label>
                    <input
                        type="date"
                        id="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>
                <button type="submit">Add Expense</button>
            </form>
            {message && <div>{message}</div>}

            {/* Expense List */}
            <h2>Expenses</h2>
            <ul>
                {expenses.map((expense) => (
                    <li key={expense._id}>
                        {expense.date.substring(0, 10)} - {expense.category}: {expense.name} - ${expense.cost}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ExpenseLogPage;
