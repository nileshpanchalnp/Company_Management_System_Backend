import express from 'express';
import {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  approveLeave,
  rejectLeave,
  getActiveLeaveTypes,
} from '../controllers/Leave.js';
import { protect } from '../middleware/authMiddleware.js';

const Leave_router = express.Router();

/* EMPLOYEE */
Leave_router.post('/apply', protect, applyLeave);
Leave_router.get('/myleave', protect, getMyLeaves);
Leave_router.get('/types', protect, getActiveLeaveTypes);

/* ADMIN / HR */
Leave_router.get('/getall', getAllLeaves);
Leave_router.put('/approve/:id', protect, approveLeave);
Leave_router.put('/reject/:id', protect, rejectLeave);

export default Leave_router;
