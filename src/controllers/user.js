import User from '../models/user.js';
import Employee from '../models/employee.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRE } from '../config/jwt.js';

/* ================= LOGIN ================= */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required' });
    }

    // Check if any users exist (first login)
    const userCount = await User.countDocuments();

    if (userCount === 0) {
      // first default admin login
      if (email !== 'admin@company.com' || password !== 'password') {
        return res.status(403).json({ success: false, message: 'Only default admin can login first' });
      }

      const admin = await User.create({
        email,
        password,
        role: 'admin',
        is_active: true,
      });

      const token = jwt.sign({ id: admin._id, role: admin.role }, JWT_SECRET, { expiresIn: JWT_EXPIRE });

      return res.json({
        success: true,
        token,
        user: { id: admin._id, email: admin.email, role: admin.role, is_active: admin.is_active },
      });
    }

    // Normal login
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (!user.is_active) {
      return res.status(403).json({ success: false, message: 'Account disabled' });
    }

    // NOTE: plain text password check (replace with bcrypt later)
    if (password !== user.password) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Optional: link employee
    const employee = await Employee.findOne({ user: user._id });

const token = jwt.sign(
  {
    id: admin._id,
    role: admin.role,
        employeeId: employee?._id || null,
  },
  JWT_SECRET,
  { expiresIn: JWT_EXPIRE }
);

    return res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        is_active: user.is_active,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

/* ================= REGISTER (Admin/HR Only) ================= */
export const register = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ success: false, message: 'Email, password, and role are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const user = await User.create({ email, password, role, is_active: true });

    return res.status(201).json({
      success: true,
      message: 'User created',
      user: { id: user._id, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};
