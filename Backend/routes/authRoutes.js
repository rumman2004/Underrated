const express = require('express');
const router = express.Router();
const { loginAdmin } = require('../controllers/AuthController');

// Route: POST /api/auth/login
router.post('/login', loginAdmin);

module.exports = router;