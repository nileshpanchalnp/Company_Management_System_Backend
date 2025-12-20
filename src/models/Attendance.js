import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },

    date: {
      type: String, // YYYY-MM-DD
      required: true,
    },

    check_in: {
      type: Date,
    },

    check_out: {
      type: Date,
    },

    total_hours: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["present", "absent", "half-day"],
      default: "present",
    },
  },
  { timestamps: true }
);

// one attendance per employee per day
attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

export default mongoose.model("Attendance", attendanceSchema);
