import mongoose from 'mongoose';

const leaveSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
    },
    leave_type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LeaveType',
      required: true,
    },
    from_date: { type: Date, required: true },
    to_date: { type: Date, required: true },
    total_days: { type: Number, required: true },
    reason: { type: String, required: true },

    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },

    approved_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    approved_at: Date,
    rejection_reason: String,
  },
  { timestamps: true }
);

export default mongoose.model('Leave', leaveSchema);
