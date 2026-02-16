const UserContact = require('../models/UserContact');

// @desc    Handle Contact Form Submission
// @route   POST /api/users/contact
const submitContact = async (req, res) => {
  try {
    const { name, email, message, type, placeName, location } = req.body;

    // Basic Validation
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    // Save to Database
    const newMessage = await UserContact.create({
      name,
      email,
      message,
      type: type || 'General Inquiry',
      placeName: placeName || '',
      location: location || ''
    });

    res.status(201).json({ 
      message: 'Message received! We will contact you soon.', 
      data: newMessage 
    });
  } catch (error) {
    console.error("Contact Submission Error:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { submitContact };