const express = require('express');
const {createDepartment,getDepartments} = require('../controllers/department.js');

const department_router = express.Router();

department_router.post('/create', createDepartment);
department_router.get('/get', getDepartments);

module.exports = department_router;
