const express = require('express');
const { login, register } = require('../controllers/user.js');
const auth = require('../middleware/authMiddleware.js');
const role = require('../middleware/role.middleware.js');
const userRoutes = express.Router();

userRoutes.post('/login', login);

// Only admin can create users
userRoutes.post('/register', auth, role('admin'), register);

module.exports = userRoutes;
