const mongoose = require('mongoose');

const otpCodeSchema = new mongoose.Schema({
  email: { type: String, required: true, index: true },
  code: { type: String, required: true },
  purpose: { type: String, enum: ['register', 'login'], required: true },
  expiresAt: { type: Date, required: true, index: { expires: 0 } },
  consumed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('OtpCode', otpCodeSchema);
