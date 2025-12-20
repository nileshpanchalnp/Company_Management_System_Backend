import express from "express";
import {
  checkIn,
  checkOut,
  getTodayAttendance,
  getMonthlyAttendance,
} from "../controllers/Attendance.js";
import { protect } from "../middleware/authMiddleware.js";

const Attendance_router = express.Router();

Attendance_router.get("/today/:employeeId",protect, getTodayAttendance);
Attendance_router.post("/check-in", protect, checkIn);
Attendance_router.post("/check-out",protect, checkOut);
Attendance_router.get("/monthly", getMonthlyAttendance);
    
export default Attendance_router;
