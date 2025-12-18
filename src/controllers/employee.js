import Employee from '../models/employee.js';
import User from '../models/user.js';
import sendEmail from '../utils/sendEmail.js';

/* ================= CREATE EMPLOYEE ================= */
export const createEmployee = async (req, res) => {
  try {
    const { email, full_name } = req.body;

    // 1️⃣ Create Employee
    const employee = await Employee.create(req.body);

    // 2️⃣ Check if User already exists
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      const defaultPassword = '123456';

      // 3️⃣ Create User account
      await User.create({
        email,
        password: defaultPassword, // plain (as per your system)
        role: 'employee',
        is_active: true,
      });

      // 4️⃣ Send Email
      await sendEmail({
        to: email,
        subject: 'Your Employee Login Credentials',
        text: `
Hello ${full_name},

Your employee account has been created.

Login Details:
Email: ${email}
Password: 123456

Please login and change your password after first login.

Thank you,
HR Team
        `,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Employee & user account created successfully',
      data: employee,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET ALL ================= */
export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find()
      .populate('department', 'name')
      .populate('job_role', 'title')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: employees,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET BY ID ================= */
export const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id)
      .populate('department', 'name')
      .populate('job_role', 'title');

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    res.json({
      success: true,
      data: employee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMe = async (req, res) => {
 try {
    if (!req.user.employeeId) {
      return res.status(404).json({
        success: false,
        message: 'Employee profile not found for this user',
      });
    }

    const employee = await Employee.findById(req.user.employeeId)
      .populate('department', 'name')
      .populate('job_role', 'title');

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    res.json({ success: true, data: employee });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


/* ================= UPDATE ================= */
export const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
      .populate('department', 'name')
      .populate('job_role', 'title');

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    res.json({
      success: true,
      data: employee,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= DELETE ================= */
export const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    res.json({
      success: true,
      message: 'Employee deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
