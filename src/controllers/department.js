const Department = require('../models/department.js');

exports.createDepartment = async (req, res) => {
  const department = await Department.create(req.body);
  res.status(201).json(department);
};

exports.getDepartments = async (req, res) => {
  const departments = await Department.find();
  res.json(departments);
};
