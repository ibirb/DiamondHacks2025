// backend/index.js
const express = require('express');
const cors = require('cors');
const connectToDatabase = require('./db');
const { createUser } = require('./controllers/userController'); // Import the createUser function
const { loginUser } = require('./controllers/userController'); // Import the loginUser function
const { createExpense, getExpensesByUser } = require('./controllers/expenseController'); // Import expense controller

const app = express();
const port = 3001;

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON request bodies
app.use(express.json());

// Connect to MongoDB before starting the server
connectToDatabase();

// Example API endpoint
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

// API endpoint to create a new user
app.post('/api/users', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const newUser = await createUser(username, password);
    res.status(201).json(newUser); // Respond with the created user
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});


// API endpoint to login a user
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const user = await loginUser(username, password);
    res.status(200).json(user); // Respond with the user
  } catch (error) {
    res.status(401).json({ error: error.message }); // Unauthorized
  }
});


// API endpoint to create a new expense
app.post('/api/expenses', async (req, res) => {
  const { user, category, name, cost, date } = req.body;

  if (!user || !category || !name || !cost) {
    return res.status(400).json({ error: 'User, category, name, and cost are required' });
  }

  try {
    const newExpense = await createExpense(user, category, name, cost, date);
    res.status(201).json(newExpense);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create expense' });
  }
});

// API endpoint to get expenses by user
app.get('/api/expenses/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const expenses = await getExpensesByUser(userId);
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get expenses' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Backend server listening on port ${port}`);
});
