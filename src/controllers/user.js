import User from '../models/user.js';
import Employee from '../models/employee.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRE } from '../config/jwt.js';

/* ================= LOGIN ================= */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required' });
    }

    const userCount = await User.countDocuments();

    // FIRST LOGIN → DEFAULT ADMIN
    if (userCount === 0) {
      if (email !== 'admin@company.com' || password !== 'password') {
        return res.status(403).json({ success: false, message: 'Only default admin can login first' });
      }

      const admin = await User.create({
        email,
        password,
        role: 'admin',
        is_active: true,
      });

      const token = jwt.sign(
        { id: admin._id, role: admin.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRE }
      );

      return res.json({
        success: true,
        token,
        user: {
          id: admin._id,
          email: admin.email,
          role: admin.role,
          is_active: admin.is_active,
        },
      });
    }

    // NORMAL LOGIN
    const user = await User.findOne({ email });
    if (!user || password !== user.password) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (!user.is_active) {
      return res.status(403).json({ success: false, message: 'Account disabled' });
    }

    const employee = await Employee.findOne({ user: user._id });

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        employeeId: employee?._id || null,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRE }
    );

    return res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        is_active: user.is_active,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};


/* ================= REGISTER (Admin/HR Only) ================= */
export const register = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ success: false, message: 'Email, password, and role are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const user = await User.create({ email, password, role, is_active: true });

    return res.status(201).json({
      success: true,
      message: 'User created',
      user: { id: user._id, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// export const register = async (req, res) => {
//   try {
//     const { email, password, role, employeeData } = req.body;

//     const user = await User.create({
//       email,
//       password,
//       role,
//       is_active: true,
//     });

//     // 👇 If employee user → create profile
//     if (role === 'employee') {
//       await Employee.create({
//         user: user._id, // ✅ LINK
//         email,
//         employee_code: employeeData.employee_code,
//         full_name: employeeData.full_name,
//         department: employeeData.department,
//         job_role: employeeData.job_role,
//         joining_date: employeeData.joining_date,
//         basic_salary: employeeData.basic_salary,
//       });
//     }

//     res.status(201).json({ success: true, message: 'User created' });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };
