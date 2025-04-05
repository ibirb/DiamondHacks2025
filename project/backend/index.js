// backend/index.js
const express = require('express');
const cors = require('cors');
const connectToDatabase = require('./db'); // Import the connection function
const app = express();
const port = 3001;

// Enable CORS for all routes
app.use(cors());

// Connect to MongoDB before starting the server
connectToDatabase();

// Example API endpoint
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

// More API endpoints will go here...

// Start the server
app.listen(port, () => {
  console.log(`Backend server listening on port ${port}`);
});
