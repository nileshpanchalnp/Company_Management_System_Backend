import express from 'express';
import { createDepartment, getDepartments } from '../controllers/department.js';


const department_router = express.Router();

// Create department (Admin / HR only)
department_router.post('/create', createDepartment);

// Get all departments (any logged-in user)
department_router.get('/get', getDepartments);

export default department_router;