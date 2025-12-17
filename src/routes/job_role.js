const express = require('express');
const {createJobRole,getJobRoles} = require('../controllers/job_role.js');

const job_role_router = express.Router();

job_role_router.post('/create', createJobRole);
job_role_router.get('/get', getJobRoles);

module.exports = job_role_router;
