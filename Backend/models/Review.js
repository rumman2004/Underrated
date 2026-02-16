const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  placeId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Place', 
    required: false // Optional if linking loosely
  },
  placeName: { type: String, required: true }, // Store name for easier display
  user: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected'], 
    default: 'Pending' 
  },
  isTestimonial: { type: Boolean, default: false } // The field for your "Select Testimonial" feature
}, {
  timestamps: true
});

module.exports = mongoose.model('Review', ReviewSchema);