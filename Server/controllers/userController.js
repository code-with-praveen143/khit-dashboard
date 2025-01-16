const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

// Register a new user
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Access the tenant-specific User model
    const User =  req.tenantDbUser;
 
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save a new user
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();

    logger.info(`User registered: ${email}`);
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    logger.error(`Error registering user: ${error.message}`);
    res.status(500).json({ message: 'Error registering user', details: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Access the tenant-specific User model
    const User = req.tenantDbUser;

    // Normalize email input for case-insensitive comparison
    const normalizedEmail = email.trim().toLowerCase();

    // Find user by email
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Generate JWT with tenant and user data
    const token = jwt.sign(
      { id: user._id, role: user.role, tenantId: req.tenantId },
      process.env.JWT_SECRET,
      { expiresIn: '1d' } // Token expires in 1 day
    );

    logger.info(`User logged in: ${email}`);

    // Exclude sensitive fields before sending response
    const { password: _, ...userWithoutPassword } = user.toObject();

    res.status(200).json({
      message: 'Login successful',
      token,
      user: userWithoutPassword, // User details without password
    });
  } catch (error) {
    logger.error(`Error logging in user: ${error.message}`);
    res.status(500).json({
      message: 'Error logging in user',
      details: error.message,
    });
  }
};


// Get details of the currently logged-in user
const getUserDetails = async (req, res) => {
  try {
    // Access the tenant-specific User model
    const User = req.tenantDbUser;

    // Find the user by ID (from JWT payload)
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json(user);
  } catch (error) {
    logger.error(`Error fetching user details: ${error.message}`);
    res.status(500).json({ message: 'Error fetching user details', details: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    // Access the tenant-specific User model
    const User = req.tenantDbUser ;
    
    // Fetch all users
    const users = await User.find().select('-password'); // Exclude passwords from the result
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', details: error.message });
  }
};


// Get details of a specific user by ID
const getUserById = async (req, res) => {
  try {
    // Access the tenant-specific User model
    const User = req.tenantDbUser;

    // Get the user ID from the request parameters
    const userId = req.params.id;

    // Find the user by ID
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json(user);
  } catch (error) {
    logger.error(`Error fetching user details: ${error.message}`);
    res.status(500).json({ message: 'Error fetching user details', details: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserDetails,
  getAllUsers,
  getUserById
};
