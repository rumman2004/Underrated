const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Place = require('./models/Place'); 
dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
    await Place.deleteMany({}); // Deletes ALL places
    console.log("Database cleared!");
    process.exit();
});