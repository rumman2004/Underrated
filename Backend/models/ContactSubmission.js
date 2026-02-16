const mongoose = require('mongoose');

const ContactSubmissionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['General Inquiry', 'Place Suggestion'], 
    required: true 
  },
  
  // Fields specific to Place Suggestions
  placeName: { type: String },
  location: { type: String },
  mapUrl: { type: String },
  description: { type: String }, // User's reason for suggestion
  
  // General Message (or concatenated details)
  message: { type: String }, 
  
  // Images for suggestions
  images: [{ type: String }],
  
  status: { 
    type: String, 
    enum: ['New', 'Read', 'Accepted', 'Rejected'], 
    default: 'New' 
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ContactSubmission', ContactSubmissionSchema);