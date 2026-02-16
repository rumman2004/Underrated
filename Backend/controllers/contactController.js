const ContactSubmission = require('../models/ContactSubmission');

// @desc    Submit a new contact form (Public)
// @route   POST /api/contacts
const submitContact = async (req, res) => {
  try {
    const { name, email, type, placeName, location, mapUrl, message, images } = req.body;

    // Basic Validation
    if (!name || !email || !type) {
      return res.status(400).json({ message: 'Name, Email, and Type are required.' });
    }

    // Extract images from message if they were appended as text, 
    // OR allow frontend to send an 'images' array directly (better).
    // For now, we save whatever the frontend sends.
    
    const newSubmission = await ContactSubmission.create(req.body);
    
    res.status(201).json({ message: 'Submission received successfully', data: newSubmission });
  } catch (error) {
    console.error("Contact Submit Error:", error);
    res.status(500).json({ message: 'Server error processing your request.' });
  }
};

// @desc    Get all submissions (Admin)
// @route   GET /api/contacts
const getSubmissions = async (req, res) => {
  try {
    const submissions = await ContactSubmission.find().sort({ createdAt: -1 });
    res.status(200).json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a submission
// @route   DELETE /api/contacts/:id
const deleteSubmission = async (req, res) => {
  try {
    await ContactSubmission.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Submission deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update status (Mark as Read/Accepted)
// @route   PUT /api/contacts/:id
const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await ContactSubmission.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true }
    );
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { submitContact, getSubmissions, deleteSubmission, updateStatus };