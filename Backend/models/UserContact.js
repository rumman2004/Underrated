const mongoose = require('mongoose');

const UserContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['General Inquiry', 'Place Suggestion', 'Bug Report'], 
    default: 'General Inquiry' 
  },
  
  // Specific to "Suggest a Place"
  placeName: { type: String },
  location: { type: String },
  
  message: { type: String, required: true },
  
  status: { 
    type: String, 
    enum: ['New', 'Read', 'Replied'], 
    default: 'New' 
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('UserContact', UserContactSchema);  