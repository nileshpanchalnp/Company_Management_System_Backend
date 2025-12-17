const User = require('../models/user.js');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRE } = require('../config/jwt.js');

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Check if any user exists
    const userCount = await User.countDocuments();

    // 2️⃣ FIRST LOGIN (NO USERS IN DB)
    if (userCount === 0) {
      // hardcoded first admin
      if (
        email !== 'admin@company.com' ||
        password !== 'password'
      ) {
        return res.status(403).json({
          message: 'Only default admin can login first'
        });
      }

      // create admin in DB
      const admin = await User.create({
        email,
        password,
        role: 'admin',
        is_active: true
      });

      const token = jwt.sign(
        { id: admin._id, role: admin.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRE }
      );

      return res.json({
        token,
        user: {
          id: admin._id,
          email: admin.email,
          role: admin.role,
          is_active: admin.is_active
        }
      });
    }

    // 3️⃣ NORMAL LOGIN (DB BASED)
    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: 'Invalid email or password' });

    if (!user.is_active)
      return res.status(403).json({ message: 'Account disabled' });

    if (password !== user.password)
      return res.status(401).json({ message: 'Invalid email or password' });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRE }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        is_active: user.is_active
      }
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// REGISTER (Admin use)
exports.register = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({
      email,
      password, // stored as plain text
      role,
    });

    res.status(201).json({
      message: 'User created',
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
