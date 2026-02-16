const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

const placesRoutes = require('./routes/placesRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const contactRoutes = require('./routes/contactRoutes');

// Load env vars
dotenv.config({ path: './utils/.env' }); 

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: "*", // Allow all origins for now (adjust for production security)
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/places', placesRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/contacts', contactRoutes);

// Health Check
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Vercel requires exporting the app
module.exports = app;

// Only listen if NOT running in Vercel (for local dev)
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}