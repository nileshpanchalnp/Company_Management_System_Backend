// src/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/jwt.js';
import Employee from '../models/employee.js';

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer'))
    return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // 🔑 Find employee linked to user
    const userId = decoded.id || decoded._id;
    const employee = await Employee.findOne({ user: userId });

    req.user = {
      id: userId,
      _id: userId,
      role: decoded.role,
      employeeId: user.employeeId,
      employeeId: employee?._id || null,
    };

    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

/* ================= ROLE CHECK ================= */
export const adminOrHR = (req, res, next) => {
  if (!['admin', 'hr'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};
