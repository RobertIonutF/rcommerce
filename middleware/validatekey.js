const User = require('../models/User');

const validateKey = async (req, res, next) => {
  const apiKey = req.headers['api-key'];

  // Check if apiKey is provided
  if (!apiKey) {
    return res.status(401).json({ error: 'API key is missing' });
  }

  try {
    // Find the user with the provided API key
    const user = await User.findOne({ apiKey });

    // Check if user exists and apiKey is valid
    if (!user) {
      return res.status(401).json({ error: 'Invalid API key' });
    }

    // Store the user object in the request for further use
    req.user = user;

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Failed to validate API key', message: error.message });
  }
};

module.exports = validateKey;
