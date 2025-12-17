const express = require('express');
require('dotenv').config();
const cors = require('cors');
const connectDB = require('./src/config/db.js');
const userRoutes = require('./src/routes/user.js');
const employee_router = require('./src/routes/employee.js')
const department_router = require('./src/routes/department.js')
const job_role_router = require('./src/routes/job_role.js')

const app = express();

// DB
connectDB();

// Middleware
app.use(
  cors({
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  })
);
app.use(express.json());

// Routes
app.use('/user',userRoutes);
app.use('/employee',employee_router)
app.use('/department',department_router)
app.use('/job_role',job_role_router)

// Test protected route
app.get('/api/protected', require('./src/middleware/authMiddleware.js'), (req, res) => {
  res.json({ message: 'Protected route', user: req.user });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
