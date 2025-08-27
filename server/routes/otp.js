const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const OtpCode = require('../models/OtpCode');
const { sendOtpEmail } = require('../utils/mailer');

// IMPORTANT: We use the already-compiled User model from server.js via mongoose.model('User')
// to avoid OverwriteModelError
const User = () => mongoose.model('User');

const router = express.Router();

// helpers
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();
const ttlMinutes = 10;

// Request OTP for register or login
// body: { email, purpose: 'register'|'login', firstName?, lastName? }
router.post('/request', async (req, res) => {
  try {
    const { email, purpose, firstName, lastName } = req.body || {};
    if (!email || !purpose || !['register', 'login'].includes(purpose)) {
      return res.status(400).json({ success: false, message: 'email and valid purpose are required' });
    }

    // If login purpose, ensure user exists
    if (purpose === 'login') {
      const existing = await User().findOne({ email });
      if (!existing) return res.status(404).json({ success: false, message: 'No account for this email' });
    }

    // Create OTP
    const code = generateOtp();
    const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000);

    // Invalidate previous unconsumed OTPs for same email/purpose
    await OtpCode.updateMany({ email, purpose, consumed: false }, { $set: { consumed: true } });

    await OtpCode.create({ email, code, purpose, expiresAt });

    await sendOtpEmail(email, code, purpose);

    res.json({ success: true, message: `OTP sent to ${email}` });
  } catch (err) {
    console.error('OTP request error:', err);
    res.status(500).json({ success: false, message: 'Server error requesting OTP' });
  }
});

// Verify OTP
// body: { email, code, purpose: 'register'|'login', firstName?, lastName? }
router.post('/verify', async (req, res) => {
  try {
    const { email, code, purpose } = req.body || {};
    if (!email || !code || !purpose || !['register', 'login'].includes(purpose)) {
      return res.status(400).json({ success: false, message: 'email, code and valid purpose are required' });
    }

    const entry = await OtpCode.findOne({ email, code, purpose, consumed: false });
    if (!entry) return res.status(400).json({ success: false, message: 'Invalid code' });
    if (entry.expiresAt < new Date()) return res.status(400).json({ success: false, message: 'Code expired' });

    // Mark consumed
    entry.consumed = true;
    await entry.save();

    let user = await User().findOne({ email });

    if (purpose === 'register') {
      if (user) return res.status(400).json({ success: false, message: 'User already exists' });
      // Create user with a random password (passwordless managed via OTP)
      const randomPassword = require('crypto').randomBytes(16).toString('hex');
      // Ensure non-empty first/last names to satisfy required fields in server's User schema
      user = new (User())({ email, password: randomPassword, firstName: 'User', lastName: 'User' });
      await user.save();
    } else {
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Issue JWT
    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '7d' });

    res.json({ success: true, message: 'OTP verified', token, user: user.toJSON() });
  } catch (err) {
    console.error('OTP verify error:', err);
    res.status(500).json({ success: false, message: 'Server error verifying OTP' });
  }
});

module.exports = router;
