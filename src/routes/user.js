import express from 'express';
import { login, register } from '../controllers/user.js';
import { protect, adminOrHR } from '../middleware/authMiddleware.js';

const userRoutes = express.Router();

// Login (public)
userRoutes.post('/login', login);

// Register (Admin / HR only)
userRoutes.post('/register', protect, adminOrHR, register);

export default userRoutes;
