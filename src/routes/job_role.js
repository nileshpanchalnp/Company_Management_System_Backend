import express from 'express';
import { createJobRole, getJobRoles } from '../controllers/job_role.js';
import { protect, adminOrHR } from '../middleware/authMiddleware.js';

const job_role_router = express.Router();

// Create job role (Admin / HR only)
job_role_router.post('/create', protect, adminOrHR, createJobRole);

// Get all job roles (any logged-in user)
job_role_router.get('/get', protect, getJobRoles);

export default job_role_router;
