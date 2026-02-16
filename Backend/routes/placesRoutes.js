const express = require('express');
const router = express.Router();
const multer = require('multer');
const { getPlaces, getPlaceById, createPlace, updatePlace, deletePlace, uploadImage } = require('../controllers/placesController');

// Multer setup for handling file uploads in memory temporarily
const storage = multer.diskStorage({});
const upload = multer({ storage });

// Define Routes
router.get('/', getPlaces);
router.get('/:id', getPlaceById);
router.post('/', createPlace);
router.put('/:id', updatePlace);
router.delete('/:id', deletePlace);
// Image Upload Route
router.post('/upload', upload.single('image'), uploadImage);

module.exports = router;