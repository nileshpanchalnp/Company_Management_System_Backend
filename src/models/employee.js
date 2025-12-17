const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  // Basic Info
  employee_code: {
    type: String,
    required: true,
    unique: true
  },
  full_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: String,
  date_of_birth: Date,
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },

  // Employment Details
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  job_role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobRole',
    required: true
  },
  joining_date: {
    type: Date,
    required: true
  },
  employment_status: {
    type: String,
    enum: ['active', 'inactive', 'terminated', 'resigned'],
    default: 'active'
  },

  // Salary
  basic_salary: {
    type: Number,
    required: true
  },

  // Bank Details
  bank_account_number: String,
  bank_name: String,
  ifsc_code: String,

  // Identity & Contact
  aadhaar_number: String,
  pan_number: String,
  emergency_contact: String,
  address: String

}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
