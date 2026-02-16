/**
 * Migration Script: Convert ObjectID to Numeric IDs
 * 
 * This script converts existing places with MongoDB ObjectIDs 
 * to simple numeric IDs (001, 002, 003, etc.)
 * 
 * WARNING: This will change all place IDs!
 * Make a backup of your database before running this!
 */

const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB (without deprecated options)
mongoose.connect(process.env.MONGO_URI);

// Listen for connection events
mongoose.connection.on('connected', () => {
  console.log('✅ Connected to MongoDB\n');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// Define the schema
const PlaceSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.Mixed, // Allow any type during migration
  name: String,
  city: String,
  location: String,
  desc: String,
  categories: [String],
  category: String,
  mapUrl: String,
  latitude: Number,
  longitude: Number,
  bestTime: String,
  openDays: String,
  images: [String],
  image: String,
  rating: Number,
  verified: Boolean
}, { 
  timestamps: true,
  strict: false // Allow flexible schema during migration
});

const Place = mongoose.model('Place', PlaceSchema);

async function migrateToNumericIds() {
  try {
    console.log('🔄 Starting migration to numeric IDs...\n');
    
    // Get all places sorted by creation date
    const places = await Place.find().sort({ createdAt: 1 });
    
    if (places.length === 0) {
      console.log('✅ No places found. Database is empty.');
      return;
    }

    console.log(`📊 Found ${places.length} places to migrate\n`);

    // Create a temporary collection to store new documents
    const newPlaces = [];

    for (let i = 0; i < places.length; i++) {
      const place = places[i];
      const newId = (i + 1).toString().padStart(3, '0'); // 001, 002, 003, etc.
      
      console.log(`   ${i + 1}. Converting: ${place._id} → ${newId} (${place.name})`);

      // Create new place object with numeric ID
      const newPlace = {
        _id: newId,
        name: place.name,
        city: place.city,
        location: place.location || place.city,
        desc: place.desc,
        categories: place.categories,
        category: place.category,
        mapUrl: place.mapUrl,
        latitude: place.latitude,
        longitude: place.longitude,
        bestTime: place.bestTime,
        openDays: place.openDays,
        images: place.images,
        image: place.image,
        rating: place.rating,
        verified: place.verified,
        createdAt: place.createdAt,
        updatedAt: place.updatedAt
      };

      newPlaces.push(newPlace);
    }

    console.log('\n🗑️  Deleting old documents...');
    
    // Delete all old places
    await Place.deleteMany({});

    console.log('✅ Old documents deleted\n');
    console.log('💾 Inserting new documents with numeric IDs...');

    // Insert all new places with numeric IDs
    await Place.insertMany(newPlaces);

    console.log('✅ New documents inserted\n');
    console.log('✨ Migration completed successfully!\n');
    console.log('📋 Summary:');
    console.log(`   - Migrated ${newPlaces.length} places`);
    console.log(`   - New ID format: 001, 002, 003, etc.`);
    console.log(`   - Old ObjectIDs have been replaced\n`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run migration
console.log('═══════════════════════════════════════');
console.log('  Database Migration: ObjectID → Numeric');
console.log('═══════════════════════════════════════\n');

// Wait for connection before running migration
mongoose.connection.once('open', async () => {
  try {
    await migrateToNumericIds();
    console.log('\n✅ All done! Your places now have numeric IDs.');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
});