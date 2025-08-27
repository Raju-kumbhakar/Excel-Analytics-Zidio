const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 5001; // Use different port to avoid conflicts

// Middleware
app.use(cors());
app.use(express.json());

// Simple test route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!', timestamp: new Date() });
});

// User registration route (simplified)
app.post('/api/auth/register', async (req, res) => {
  try {
    console.log('Registration request received:', req.body);
    
    const { email, password, firstName, lastName } = req.body;
    
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // For now, just return success without saving to database
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: { email, firstName, lastName }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Simple server running on port ${PORT}`);
  console.log(`Test URL: http://localhost:${PORT}/test`);
});

// Connect to MongoDB (optional for this test)
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection failed:', err.message));
}
