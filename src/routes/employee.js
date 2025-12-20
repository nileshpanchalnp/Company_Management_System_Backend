import express from 'express';
import {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  getMe
} from '../controllers/employee.js';
import { protect, adminOrHR } from '../middleware/authMiddleware.js';

const employee_router = express.Router();

// Create employee (Admin / HR only)
employee_router.post('/create', protect, adminOrHR, createEmployee);

// Get all employees (Admin / HR only)
employee_router.get('/get', getEmployees);

employee_router.get('/me',protect,getMe)

// Get single employee by ID (Admin / HR only)
employee_router.get('/getone/:_id', getEmployeeById);

// Update employee by ID (Admin / HR only)
employee_router.put('/update/:id', protect, adminOrHR, updateEmployee);

// Delete employee by ID (Admin / HR only)
employee_router.delete('/delete/:id', protect, adminOrHR, deleteEmployee);

export default employee_router;
