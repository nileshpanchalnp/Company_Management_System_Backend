import Leave from '../models/Leave.js';
import LeaveType from '../models/LeaveType.js';

/* ================= EMPLOYEE ================= */

// Apply Leave
export const applyLeave = async (req, res) => {
  try {
    if (!req.user.employeeId) {
      return res.status(400).json({
        success: false,
        message: 'Employee not found. Please contact HR.',
      });
    }

    const {
      leave_type_id,
      from_date,
      to_date,
      total_days,
      reason,
    } = req.body;

    const leave = await Leave.create({
      employee: req.user.employeeId,
      leave_type: leave_type_id,
      from_date,
      to_date,
      total_days,
      reason,
    });

    res.status(201).json({
      success: true,
      message: 'Leave applied successfully',
      data: leave,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Employee – My Leaves
export const getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ employee: req.user.employeeId })
      .populate('leave_type', 'name')
      .sort({ createdAt: -1 });

    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= ADMIN / HR ================= */

// Get All Leave Requests
export const getAllLeaves = async (req, res) => {
  try {
    const { status } = req.query;

    const filter = status && status !== 'all' ? { status } : {};

    const leaves = await Leave.find(filter)
      .populate('leave_type', 'name')
      .populate('employee', 'full_name employee_code')
      .sort({ createdAt: -1 });

    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve Leave
export const approveLeave = async (req, res) => {
  try {
    // Safety Check
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authenticated correctly" });
    }

    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      {
        status: 'approved',
        approved_by: req.user.id, 
        approved_at: new Date(),
      },
      { new: true }
    );

    if (!leave) return res.status(404).json({ message: "Leave not found" });
    res.json({ message: 'Leave approved', leave });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reject Leave
export const rejectLeave = async (req, res) => {
  try {
    const { reason } = req.body;

    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      {
        status: 'rejected',
        approved_by: req.user.id,
        approved_at: new Date(),
        rejection_reason: reason,
      },
      { new: true }
    );

    res.json({ message: 'Leave rejected', leave });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Leave Types
export const getActiveLeaveTypes = async (req, res) => {
  try {
    const types = await LeaveType.find({ is_active: true });
    res.json(types);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
