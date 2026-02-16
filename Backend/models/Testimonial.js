const mongoose = require('mongoose');

const TestimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, default: 'Explorer' }, // e.g., "Travel Blogger", "Local Guide"
  message: { type: String, required: true },
  avatar: { type: String }, // URL to user's profile pic
  featured: { type: Boolean, default: false }, // Toggle to show on homepage
  rating: { type: Number, default: 5 }
}, {
  timestamps: true
});

module.exports = mongoose.model('Testimonial', TestimonialSchema);