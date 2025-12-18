import LeaveType from '../models/LeaveType.js';

/**
 * @desc    Create Leave Type (Admin/HR)
 * @route   POST /api/leave-type
 */
export const createLeaveType = async (req, res) => {
  try {
    const { name, days_per_year } = req.body;

    if (!name || !days_per_year) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const exists = await LeaveType.findOne({ name });
    if (exists) {
      return res.status(400).json({ message: 'Leave type already exists' });
    }

    const leaveType = await LeaveType.create({
      name,
      days_per_year,
    });

    res.status(201).json({
      message: 'Leave type created successfully',
      data: leaveType,
    });
  } catch (error) {
    console.error('Create leave type error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Get all active leave types
 * @route   GET /api/leave-type
 */
export const getLeaveTypes = async (req, res) => {
  try {
    const leaveTypes = await LeaveType.find({ is_active: true }).sort({
      createdAt: -1,
    });

    res.json({
      data: leaveTypes,
    });
  } catch (error) {
    console.error('Get leave types error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Update Leave Type (Admin/HR)
 * @route   PUT /api/leave-type/:id
 */
export const updateLeaveType = async (req, res) => {
  try {
    const { id } = req.params;

    const leaveType = await LeaveType.findById(id);
    if (!leaveType) {
      return res.status(404).json({ message: 'Leave type not found' });
    }

    Object.assign(leaveType, req.body);
    await leaveType.save();

    res.json({
      message: 'Leave type updated successfully',
      data: leaveType,
    });
  } catch (error) {
    console.error('Update leave type error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Enable / Disable Leave Type
 * @route   PATCH /api/leave-type/:id/status
 */
export const toggleLeaveTypeStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const leaveType = await LeaveType.findById(id);
    if (!leaveType) {
      return res.status(404).json({ message: 'Leave type not found' });
    }

    leaveType.is_active = !leaveType.is_active;
    await leaveType.save();

    res.json({
      message: 'Leave type status updated',
      data: leaveType,
    });
  } catch (error) {
    console.error('Toggle leave type error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
