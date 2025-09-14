import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = Router();

// JWT secret key - in production, use environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Token verification endpoint
router.get('/verify', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      id: user._id.toString(),
      email: user.email,
      username: user.username,
      phone: user.phone,
      countryCode: user.countryCode
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reset password by phone (used by Forgot Password flow)
router.post('/reset-password', async (req, res) => {
  try {
    const { phone, newPassword } = req.body;

    const phoneDigits = String(phone || '').replace(/\D/g, '');
    if (!phoneDigits || phoneDigits.length !== 10) {
      return res.status(400).json({ message: 'Invalid phone number' });
    }
    if (!newPassword || String(newPassword).length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Try exact digits match first
    let user = await User.findOne({ phone: phoneDigits });

    // Fallback: find by any phone that contains the 10 digits, then normalize and compare
    if (!user) {
      const candidates = await User.find({ phone: { $regex: phoneDigits } }).limit(5);
      user = candidates.find(u => String(u.phone || '').replace(/\D/g, '') === phoneDigits) || null;
    }

    if (!user) {
      return res.status(404).json({ message: 'User with this phone was not found' });
    }

    user.passwordHash = await bcrypt.hash(String(newPassword), 10);
    await user.save();

    return res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Reset password error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { username, email, phone, countryCode, password } = req.body;

    if (!username || !email || !phone || !countryCode || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const emailNormalized = String(email).toLowerCase().trim();
    const phoneDigits = String(phone).replace(/\D/g, '');

    const existing = await User.findOne({ email: emailNormalized }).lean();
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email: emailNormalized,
      phone: phoneDigits,
      countryCode,
      passwordHash,
    });

    return res.status(201).json({ 
      message: 'Registration successful! Please login.',
      id: user._id.toString(), 
      email: user.email 
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Missing email or password' });
    }

    const emailNormalized = String(email).trim();
    const passwordInput = String(password);

    // Case-insensitive match to support legacy stored emails with different casing
    const emailPattern = new RegExp(`^${emailNormalized.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');
    let user = await User.findOne({ email: emailPattern });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    let isPasswordValid = false;

    // Primary: compare to bcrypt hash
    if (user.passwordHash) {
      isPasswordValid = await bcrypt.compare(passwordInput, user.passwordHash);
    }

    // Legacy fallback: if there is a plain `password` field without hash
    if (!isPasswordValid && user.password && !user.passwordHash) {
      if (user.password === passwordInput) {
        const migratedHash = await bcrypt.hash(passwordInput, 10);
        user.passwordHash = migratedHash;
        user.password = undefined;
        await user.save();
        isPasswordValid = true;
      }
    }

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { 
        userId: user._id.toString(), 
        email: user.email,
        username: user.username 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.json({
      message: 'Login successful!',
      token,
      id: user._id.toString(),
      email: user.email,
      username: user.username
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;


