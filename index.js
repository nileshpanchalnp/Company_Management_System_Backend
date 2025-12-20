import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import connectDB from './src/config/db.js';
import userRoutes from './src/routes/user.js';
import employee_router from './src/routes/employee.js';
import department_router from './src/routes/department.js';
import job_role_router from './src/routes/job_role.js';
import Leave_router from './src/routes/Leave.js';
import leave_type from './src/routes/LeaveType.js';
import Attendance_router from './src/routes/Attendance.js';
import { protect } from './src/middleware/authMiddleware.js';



const app = express();

// Connect Database
connectDB();

// Middleware
app.use(
  cors({
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use('/user',userRoutes);
app.use('/employee',employee_router)
app.use('/department',department_router) 
app.use('/job_role',job_role_router)
app.use('/leave',Leave_router);
app.use('/leave-type',leave_type);
app.use('/attendance',Attendance_router);

// Test protected route
app.get('/api/protected', protect, (req, res) => {
  res.json({ message: 'Protected route', user: req.user });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
