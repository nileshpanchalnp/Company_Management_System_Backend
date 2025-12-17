const JobRole = require('../models/job_role.js');

exports.createJobRole = async (req, res) => {
  const role = await JobRole.create(req.body);
  res.status(201).json(role);
};

exports.getJobRoles = async (req, res) => {
  const roles = await JobRole.find().populate('department');
  res.json(roles);
};
