const express = require('express');
const router = express.Router();
const { submitContact } = require('../controllers/userController');

// Route for Contact Form
router.post('/contact', submitContact);

module.exports = router;