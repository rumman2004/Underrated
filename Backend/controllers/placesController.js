const Place = require('../models/Place');
const cloudinary = require('../config/cloudinary');

// @desc  Get all places
// @route GET /api/places
const getPlaces = async (req, res) => {
  try {
    const places = await Place.find().sort({ _id: 1 });
    res.status(200).json(places);
  } catch (error) {
    console.error('Get Places Error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get single place
// @route GET /api/places/:id
const getPlaceById = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) return res.status(404).json({ message: 'Place not found' });
    res.status(200).json(place);
  } catch (error) {
    console.error('Get Place By ID Error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc  Create a new place
// @route POST /api/places
const createPlace = async (req, res) => {
  try {
    const {
      name, city, location, desc,
      categories, category,
      mapUrl, latitude, longitude,
      bestTime, openDays,
      images, image,
      rating, verified
    } = req.body;

    // Accept either city or location from the frontend
    const cityValue = city || location;

    // Explicit validation — clear error messages sent back to the frontend
    if (!name?.trim())      return res.status(400).json({ message: 'Place name is required' });
    if (!cityValue?.trim()) return res.status(400).json({ message: 'City / location is required' });
    if (!desc?.trim())      return res.status(400).json({ message: 'Description is required' });

    // Generate next sequential ID numerically (safe — no string sort)
    const nextId = await Place.generateNextId();
    console.log('Generated ID:', nextId);

    const placeData = {
      _id:        nextId,
      name:       name.trim(),
      city:       cityValue.trim(),
      location:   cityValue.trim(),
      desc:       desc.trim(),
      categories: Array.isArray(categories) ? categories : [],
      category:   category || 'Hidden Gem',
      mapUrl:     mapUrl   || '',
      bestTime:   bestTime || '',
      openDays:   openDays || 'Daily',
      images:     Array.isArray(images) ? images : [],
      image:      image || (Array.isArray(images) ? images[0] : '') || '',
      rating:     Number(rating) || 0,
      verified:   verified === true || verified === 'true',
    };

    // Only add lat/lng if they are actual numbers
    if (latitude  != null && latitude  !== '' && !isNaN(latitude))  placeData.latitude  = parseFloat(latitude);
    if (longitude != null && longitude !== '' && !isNaN(longitude)) placeData.longitude = parseFloat(longitude);

    const newPlace = await Place.create(placeData);
    console.log('Place created:', newPlace._id);

    res.status(201).json(newPlace);

  } catch (error) {
    console.error('Create Place Error:', error.message);
    res.status(400).json({ message: error.message });
  }
};

// @desc  Update a place (THIS WAS MISSING)
// @route PUT /api/places/:id
const updatePlace = async (req, res) => {
  try {
    const {
      name, city, location, desc,
      categories, category,
      mapUrl, latitude, longitude,
      bestTime, openDays,
      images, image,
      rating, verified
    } = req.body;

    const cityValue = city || location;

    const updateData = {
      name:       name?.trim(),
      city:       cityValue?.trim(),
      location:   cityValue?.trim(),
      desc:       desc?.trim(),
      categories: Array.isArray(categories) ? categories : [],
      category:   category || 'Hidden Gem',
      mapUrl:     mapUrl   || '',
      bestTime:   bestTime || '',
      openDays:   openDays || 'Daily',
      images:     Array.isArray(images) ? images : [],
      image:      image || (Array.isArray(images) ? images[0] : '') || '',
      rating:     Number(rating) || 0,
      verified:   verified === true || verified === 'true',
    };

    // Handle lat/lng safely
    if (latitude  !== undefined && latitude !== '')  updateData.latitude  = parseFloat(latitude);
    if (longitude !== undefined && longitude !== '') updateData.longitude = parseFloat(longitude);

    const updatedPlace = await Place.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true } // Returns the updated doc
    );

    if (!updatedPlace) {
      return res.status(404).json({ message: 'Place not found' });
    }

    res.status(200).json(updatedPlace);

  } catch (error) {
    console.error('Update Place Error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc  Delete a place
// @route DELETE /api/places/:id
const deletePlace = async (req, res) => {
  try {
    const placeId = req.params.id;

    const place = await Place.findById(placeId);
    if (!place) return res.status(404).json({ message: 'Place not found' });

    await Place.findByIdAndDelete(placeId);
    console.log('Place deleted:', placeId);

    res.status(200).json({
      message:     'Place removed successfully',
      deletedId:   placeId,
      deletedName: place.name,
    });

  } catch (error) {
    console.error('Delete Place Error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc  Upload image to Cloudinary
// @route POST /api/places/upload
const uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'underrated_places',
    });

    res.status(200).json({ url: result.secure_url });

  } catch (error) {
    console.error('Cloudinary Error:', error.message);
    res.status(500).json({ message: 'Image upload failed', error: error.message });
  }
};

module.exports = {
  getPlaces,
  getPlaceById,
  createPlace,
  updatePlace,
  deletePlace,
  uploadImage,
};