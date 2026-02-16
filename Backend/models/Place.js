const mongoose = require('mongoose');

const PlaceSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },

  name:     { type: String, required: true },
  city:     { type: String, required: true },
  location: { type: String }, // kept for backward compatibility
  desc:     { type: String, required: true },

  // Categorization
  categories: [{ type: String }],
  category:   { type: String, default: 'Hidden Gem' },

  // Location Data
  mapUrl:    { type: String },
  latitude:  { type: Number },
  longitude: { type: Number },

  // Visit Details
  bestTime: { type: String },
  openDays: { type: String },

  // Media
  images: [{ type: String }],
  image:  { type: String },

  // Stats
  rating:   { type: Number, default: 0 },
  verified: { type: Boolean, default: false },

}, {
  timestamps: true,
  _id: false  // we manage _id ourselves
});

// ── ID Generator ───────────────────────────────────────────────────────────────
// Uses Math.max over all existing IDs instead of sort({ _id: -1 }).
// String sort is broken for numeric IDs: "010" < "003" alphabetically,
// which causes lastId → NaN → crash ("next is not a function").
PlaceSchema.statics.generateNextId = async function () {
  const all = await this.find({}, { _id: 1 }).lean();

  if (!all.length) return '001';

  const maxId = all.reduce((max, doc) => {
    const num = parseInt(doc._id, 10);
    return isNaN(num) ? max : Math.max(max, num);
  }, 0);

  return (maxId + 1).toString().padStart(3, '0');
};

// ── Pre-save middleware ────────────────────────────────────────────────────────
// Async style (no `next` argument) — required for Mongoose 7+.
// Old callback-style hooks misroute thrown errors as "next is not a function".
PlaceSchema.pre('save', async function () {
  if (!this.location && this.city)     this.location = this.city;
  if (!this.city     && this.location) this.city     = this.location;
});

module.exports = mongoose.model('Place', PlaceSchema);