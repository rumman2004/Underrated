const express = require('express');
const router = express.Router();
const { 
  submitContact, 
  getSubmissions, 
  deleteSubmission, 
  updateStatus 
} = require('../controllers/contactController');

router.post('/', submitContact);
router.get('/', getSubmissions);
router.delete('/:id', deleteSubmission);
router.put('/:id', updateStatus);

module.exports = router;