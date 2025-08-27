const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000'
}));
app.use(express.json());

// User Schema (inline for simplicity)
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  role: { type: String, default: 'user' },
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'API is running...', timestamp: new Date() });
});

// Mount OTP routes
const otpRoutes = require('./routes/otp');
app.use('/api/otp', otpRoutes);

// Mount Admin state routes (protected via ADMIN_API_KEY)
const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);

// Register endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    console.log('Registration request:', req.body);
    
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    const user = new User({ email, password, firstName, lastName });
    await user.save();

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

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password required'
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    res.json({
      success: true,
      message: 'Login successful',
      user: { email: user.email, firstName: user.firstName, lastName: user.lastName }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// MongoDB Connection
const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error('FATAL ERROR: MONGODB_URI is not defined.');
  process.exit(1);
}

console.log('Attempting to connect to MongoDB...');
mongoose.connect(MONGO_URI)
.then(() => {
  console.log('MongoDB connected successfully.');
  // Seed superadmin on successful DB connection
  (async () => {
    try {
      const email = process.env.SUPERADMIN_EMAIL || 'superadmin@excelanalytics.app';
      const password = process.env.SUPERADMIN_PASSWORD || 'ChangeMe123!';
      const firstName = 'Super';
      const lastName = 'Admin';

      let adminUser = await User.findOne({ email });
      if (!adminUser) {
        adminUser = new User({ email, password, firstName, lastName, role: 'admin' });
        await adminUser.save();
        console.log(`Seeded superadmin user: ${email}`);
      } else if (adminUser.role !== 'admin') {
        adminUser.role = 'admin';
        await adminUser.save();
        console.log(`Ensured admin role for user: ${email}`);
      } else {
        console.log('Superadmin user already exists.');
      }
    } catch (e) {
      console.error('Error seeding superadmin:', e);
    }
  })();
  
  // Start Server only after DB connection
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Test at: http://localhost:${PORT}`);
  });
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});
