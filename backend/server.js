require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // You may need this for frontend communication
const authRoutes = require('./routes/auth');
const agentRoutes = require('./routes/agent');
require('dotenv').config();
const listRoutes = require('./routes/lists');
const app = express();
const PORT = process.env.PORT || 5000;

// Add this line to handle CORS for frontend requests
app.use(cors());

// Middleware to parse JSON. This must be placed before your routes.
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully!');
    // Start the server only after a successful database connection
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/lists', listRoutes);

// Basic route to test the server
app.get('/', (req, res) => {
  res.send('API is running...');
});