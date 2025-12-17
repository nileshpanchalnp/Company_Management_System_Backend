const express = require('express');
const {createEmployee,getEmployees,getEmployeeById,updateEmployee,deleteEmployee} = require('../controllers/employee.js');
const employee_router = express.Router();

employee_router.post('/create', createEmployee);
employee_router.get('/get', getEmployees);
employee_router.get('/getone/:id', getEmployeeById);
employee_router.put('/update/:id', updateEmployee);
employee_router.delete('/delete/:id', deleteEmployee);

module.exports = employee_router;
