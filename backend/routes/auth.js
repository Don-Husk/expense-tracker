const express = require('express');
const router = express.Router();
const User = require('../models/User');
const speakeasy = require('speakeasy');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Setup nodemailer (example with Gmail SMTP, configure properly in .env)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,    // your email here
    pass: process.env.EMAIL_PASS     // your app password or email password
  }
});

transporter.verify((err, success) => {
  if (err) {
    console.error('❌ Transporter failed to verify:', err);
  } else {
    console.log('✅ Transporter is ready to send mail');
  }
});


// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    // Generate MFA secret
    const mfaSecret = speakeasy.generateSecret({ length: 20 });

    // Create and save user
    const newUser = new User({
      email,
      password,
      mfaSecret: mfaSecret.base32,
      mfaEnabled: true
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully. Please log in to receive your MFA code.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


// Step 1: Login - verify credentials and send MFA code
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const validPassword = await user.comparePassword(password);
    if (!validPassword) return res.status(400).json({ message: 'Invalid credentials' });

    if (!user.mfaEnabled) {
      // If no MFA, directly return JWT
      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
      return res.json({ token });
    }

    // Generate TOTP code
    const token = speakeasy.totp({
      secret: user.mfaSecret,
      encoding: 'base32'
    });

    // Send token by email with detailed logging
    try {
      const info = await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Your MFA Code',
        text: `Your MFA code is: ${token}`
      });

      console.log('✅ Email sent:', info.response);  // Success log
      res.json({ message: 'MFA code sent to email' });
    } catch (err) {
      console.error('❌ Email sending failed:', err); // Shows exact reason
      res.status(500).json({ message: 'Failed to send MFA email', error: err.message });
    }

  } catch (err) {
    console.error('❌ Login server error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// Step 2: Verify MFA code and issue JWT
router.post('/mfa-verify', async (req, res) => {
  try {
    const { email, code } = req.body;

    console.log('🔍 Verifying MFA code:', { email, code }); // log input

    const user = await User.findOne({ email });
    if (!user) {
      console.error('❌ User not found for MFA verification');
      return res.status(400).json({ message: 'Invalid request' });
    }

    const verified = speakeasy.totp.verify({
      secret: user.mfaSecret,
      encoding: 'base32',
      token: code,
      window: 1  // allow slight time drift
    });

    console.log('📌 Verification result:', verified); // true or false

    if (!verified) {
      return res.status(400).json({ message: 'Invalid MFA code' });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });

  } catch (err) {
    console.error('❌ Server error during MFA verification:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
