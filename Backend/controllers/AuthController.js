const jwt = require('jsonwebtoken');

// @desc    Admin Login
// @route   POST /api/auth/login
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check against .env values
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      // Credentials match! Generate a Token
      const token = jwt.sign(
        { role: 'admin' }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1d' } // Token lasts 1 day
      );

      res.status(200).json({
        message: 'Login Successful',
        token: token,
        admin: { email: email }
      });
    } else {
      res.status(401).json({ message: 'Invalid Admin Credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { loginAdmin };