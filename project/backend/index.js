// backend/index.js
const express = require('express');
const cors = require('cors');
const connectToDatabase = require('./db');
const { createUser } = require('./controllers/userController'); // Import the createUser function

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

// Start the server
app.listen(port, () => {
  console.log(`Backend server listening on port ${port}`);
});
