const mongoose = require('mongoose');
require('dotenv').config();

console.log('Testing MongoDB connection with timeout...');
console.log('Connection string:', process.env.MONGODB_URI ? 'Found' : 'Missing');

mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 5000, // 5 second timeout
  socketTimeoutMS: 45000,
})
.then(() => {
  console.log('✅ MongoDB connected successfully!');
  process.exit(0);
})
.catch((error) => {
  console.error('❌ MongoDB connection failed:', error.message);
  process.exit(1);
});
