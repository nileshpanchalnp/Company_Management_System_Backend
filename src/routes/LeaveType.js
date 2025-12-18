import express from 'express';
import {
  createLeaveType,
  getLeaveTypes,
  updateLeaveType,
  toggleLeaveTypeStatus,
} from '../controllers/LeaveType.js';


const leave_type = express.Router();

// Public / Employee
leave_type.get('/get',  getLeaveTypes);

// Admin / HR only
leave_type.post('/create',  createLeaveType);
leave_type.put('/update/:_id',  updateLeaveType);
leave_type.patch('/:id/status',  toggleLeaveTypeStatus);

export default leave_type;
