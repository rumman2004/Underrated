const Review = require('../models/Review');

// @desc    Get all reviews (Sorted by newest)
// @route   GET /api/reviews
const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a review (Public)
// @route   POST /api/reviews
const createReview = async (req, res) => {
  try {
    const { user, rating, comment, placeName } = req.body;

    // Simple Validation
    if (!user || !rating || !comment) {
      return res.status(400).json({ message: 'Name, Rating, and Comment are required.' });
    }

    const newReview = await Review.create({
      user,
      rating,
      comment,
      // If placeName isn't provided (e.g., generic site review), use default
      placeName: placeName || 'General Feedback',
      status: 'Pending', // Always pending until Admin approves
      isTestimonial: false
    });

    res.status(201).json(newReview);
  } catch (error) {
    console.error("Create Review Error:", error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update review (Approve / Toggle Testimonial)
// @route   PUT /api/reviews/:id
const updateReview = async (req, res) => {
  try {
    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    res.status(200).json(updatedReview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
const deleteReview = async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getReviews, createReview, updateReview, deleteReview };