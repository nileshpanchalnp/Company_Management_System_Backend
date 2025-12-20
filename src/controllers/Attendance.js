import Attendance from "../models/Attendance.js";

/* ================= CHECK TODAY ATTENDANCE ================= */
export const getTodayAttendance = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const today = new Date().toISOString().split("T")[0];

    const attendance = await Attendance.findOne({
      employee: employeeId,
      date: today,
    });

    res.json(attendance);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= CHECK IN ================= */
export const checkIn = async (req, res) => {
  try {
    const { employeeId } = req.body; // frontend sends employeeId
    console.log("Check-in request for employeeId:", employeeId);

    if (!employeeId)
      return res.status(400).json({ message: 'employeeId is required' });

    const today = new Date().toISOString().split("T")[0];

    // prevent duplicate check-in
    const existing = await Attendance.findOne({ employee: employeeId, date: today });
    if (existing) {
      return res.status(400).json({ message: "Already checked in today" });
    }

    const attendance = await Attendance.create({
      employee: employeeId,  // <-- use this field name
      date: today,
      check_in: new Date(),
      status: 'present'
    });

    res.status(201).json(attendance);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};


/* ================= CHECK OUT ================= */
export const checkOut = async (req, res) => {
  try {
    const { attendanceId } = req.body;

    const attendance = await Attendance.findById(attendanceId);

    if (!attendance || attendance.check_out) {
      return res.status(400).json({ message: "Invalid checkout request" });
    }

    const checkOutTime = new Date();
    const hours =
      (checkOutTime - attendance.check_in) / (1000 * 60 * 60);

    attendance.check_out = checkOutTime;
    attendance.total_hours = Math.round(hours * 100) / 100;

    await attendance.save();

    res.json(attendance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= MONTHLY ATTENDANCE ================= */
export const getMonthlyAttendance = async (req, res) => {
  try {
    const { employeeId, month } = req.query;
    // month format: YYYY-MM

    const attendance = await Attendance.find({
      employee: employeeId,
      date: { $regex: `^${month}` },
    }).sort({ date: 1 });

    res.json(attendance);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
