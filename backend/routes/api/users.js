// Import necessary libraries and dependencies
const express = require('express');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { User } = require('../../db/models');
const bcrypt = require('bcryptjs');

const router = express.Router();

// Validation middleware for signing up a user
const validateSignup = [
  check('email')
    .isEmail()
    .withMessage('Invalid email'),
  check('username')
    .notEmpty()
    .withMessage('Username is required'),
  check('firstName')
    .notEmpty()
    .withMessage('First Name is required'),
  check('lastName')
    .notEmpty()
    .withMessage('Last Name is required'),
  handleValidationErrors,
];

// Sign Up a User
router.post('/', validateSignup, async (req, res, next) => {
  const { firstName, lastName, email, username, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({
      where: { [Op.or]: [{ email }, { username }] },
    });
    if (existingUser) {
      const errors = {};
      if (existingUser.email === email) errors.email = 'User with that email already exists';
      if (existingUser.username === username) errors.username = 'User with that username already exists';
      return res.status(500).json({
        message: 'User already exists',
        errors,
      });
    }

    // Hash the password and create new user
    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = await User.create({
      firstName,
      lastName,
      email,
      username,
      hashedPassword,
    });

    return res.status(201).json({
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

module.exports = router;
