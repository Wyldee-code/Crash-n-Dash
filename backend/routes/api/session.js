// Import necessary libraries and dependencies
const express = require('express');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { User } = require('../../db/models');
const bcrypt = require('bcryptjs');

const router = express.Router();

// Validation middleware for login
const validateLogin = [
  check('credential')
    .notEmpty()
    .withMessage('Email or username is required'),
  check('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors,
];

// Log In a User
router.post('/', validateLogin, async (req, res, next) => {
  const { credential, password } = req.body;

  try {
    // Find user by email or username
    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: credential }, { username: credential }],
      },
    });

    if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    return res.status(200).json({
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get Current User
router.get('/', async (req, res) => {
  // Assuming we have a current user session middleware or function
  const user = req.user || null;

  if (!user) {
    return res.status(200).json({ user: null });
  }

  return res.status(200).json({
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
    },
  });
});

module.exports = router;
