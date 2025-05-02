// controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// LOGIN (owner or worker)
exports.login = async (req, res) => {
    const { email, password } = req.body;
    console.log('[AuthController] login called with:', { email, password: password ? '••••' : '' });
  
    try {
      // 1) Find user
      const user = await User.findOne({ email });
      if (!user) {
        console.log('[AuthController] ❌ User not found for email:', email);
        return res.status(401).json({ message: 'User not found' });
      }
      console.log('[AuthController] ✅ User found:', user.email, 'role:', user.role);
  
      // 2) Verify password
      const valid = await bcrypt.compare(password, user.password);
      console.log('[AuthController] password valid?', valid);
      if (!valid) {
        console.log('[AuthController] ❌ Invalid credentials for:', email);
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // 3) Issue JWT
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );
      console.log('[AuthController] 🔑 JWT issued to:', email);
  
      // 4) Respond
      return res.json({ token, role: user.role });
    } catch (err) {
      console.error('[AuthController] 💥 Server error during login:', err);
      return res.status(500).json({ message: 'Server error', error: err.message });
    }
  };
  

// CREATE WORKER (owner-only)
exports.createWorker = async (req, res) => {
  const { email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Worker already exists' });

    const user = new User({ email, password: hashed, role: 'worker' });
    await user.save();
    res.status(201).json({ message: 'Worker created' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create worker' });
  }
};

// CREATE OWNER (protected by CREATE_OWNER_KEY)
exports.createOwner = async (req, res) => {
  const { email, password, key } = req.body;
  if (key !== process.env.CREATE_OWNER_KEY) {
    return res.status(403).json({ message: 'Forbidden: invalid key' });
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Owner already exists' });

    const hashed = await bcrypt.hash(password, 10);
    await User.create({ email, password: hashed, role: 'owner' });
    res.status(201).json({ message: 'Owner created' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create owner' });
  }
};
