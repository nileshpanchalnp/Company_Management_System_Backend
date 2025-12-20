import Employee from '../models/employee.js';
import User from '../models/user.js';
import sendEmail from '../utils/sendEmail.js';

/* ================= CREATE EMPLOYEE ================= */
export const createEmployee = async (req, res) => {
  try {
    const {
      email,
      full_name,
      employee_code,
      department,
      job_role,
      joining_date,
      basic_salary,
      ...rest
    } = req.body;

    // 1️⃣ Check if user already exists
    let user = await User.findOne({ email });

    if (!user) {
      // 2️⃣ Create User FIRST
      user = await User.create({
        email,
        password: '123456',
        role: 'employee',
        is_active: true,
      });

      // 3️⃣ Send credentials email
      await sendEmail({
        to: email,
        subject: 'Your Employee Login Credentials',
        text: `
Hello ${full_name},

Your employee account has been created.

Email: ${email}
Password: 123456

Please change your password after first login.

- HR Team
        `,
      });
    }

    // 4️⃣ Create Employee WITH user link (THIS WAS MISSING)
    const employee = await Employee.create({
      user: user._id, // ✅ REQUIRED
      email,
      employee_code,
      full_name,
      department,
      job_role,
      joining_date,
      basic_salary,
      ...rest,
    });

    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: employee,
    });
  } catch (error) {
    console.error(error);
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
