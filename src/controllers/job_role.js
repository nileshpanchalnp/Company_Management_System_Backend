import JobRole from '../models//job_role.js';

/* ================= CREATE JOB ROLE ================= */
export const createJobRole = async (req, res) => {
  try {
    const role = await JobRole.create(req.body);

    res.status(201).json({
      success: true,
      data: role,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET ALL JOB ROLES ================= */
export const getJobRoles = async (req, res) => {
  try {
    const roles = await JobRole.find()
      .populate('department', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: roles,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
