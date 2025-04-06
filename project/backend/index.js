// backend/index.js
const express = require('express');
const cors = require('cors');
const connectToDatabase = require('./db');
const { createUser } = require('./controllers/userController'); // Import the createUser function
const { loginUser } = require('./controllers/userController'); // Import the loginUser function
const { createExpense, getExpensesByUser } = require('./controllers/expenseController'); // Import expense controller
const chatBotRoutes = require('./routes/chatBotRoutes');
const savingGoalRoutes = require('./routes/savingGoalRoutes');
require('dotenv').config(); 

const app = express();
const port = 3001;

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON request bodies
app.use(express.json());

app.use('/api/saving-goals', savingGoalRoutes);

// Connect to MongoDB before starting the server
connectToDatabase();

// Example API endpoint
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

// API endpoint to create a new user
app.post('/api/users', async (req, res) => {
  const { username, password, name, dailySpendingGoal } = req.body; // Extract new fields

  if (!username || !password || !name || !dailySpendingGoal) { // Check for new fields
    return res.status(400).json({ error: 'Username, password, name, and daily spending goal are required' });
  }

  try {
    const newUser = await createUser(username, password, name, dailySpendingGoal); // Pass new fields
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

app.get('/api/users/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findOne({ _id: userId }); // Find the user by _id
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user); // Respond with the user data
  } catch (error) {
    res.status(500).json({ error: 'Failed to get user' });
  }
});



// API endpoint to create a new expense
app.post('/api/expenses', async (req, res) => {
  const { user, category, name, cost, date } = req.body;

  if (!user || !category || !name || !cost || !date) {
    return res.status(400).json({ error: 'User, category, name, cost, and date are required' });
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

app.use('/api', chatBotRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Backend server listening on port ${port}`);
});
