// backend/routes/api/users.js
const express = require('express');
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

// Validation middleware for signup
const validateSignup = [
  check('email').exists({ checkFalsy: true }).isEmail().withMessage('Please provide a valid email.'),
  check('username').exists({ checkFalsy: true }).isLength({ min: 4 }).withMessage('Please provide a username with at least 4 characters.'),
  check('username').not().isEmail().withMessage('Username cannot be an email.'),
  check('password').exists({ checkFalsy: true }).isLength({ min: 6 }).withMessage('Password must be 6 characters or more.'),
  check('firstName').exists({ checkFalsy: true }).withMessage('Please provide a first name.'),
  check('lastName').exists({ checkFalsy: true }).withMessage('Please provide a last name.'),
  handleValidationErrors
];

// Signup route
router.post(
  '/',
  validateSignup,
  async (req, res, next) => {
    const { email, password, username, firstName, lastName } = req.body;
    const hashedPassword = bcrypt.hashSync(password);

    try {
      // Attempt to create the new user
      const user = await User.create({
        email,
        username,
        hashedPassword,
        firstName,
        lastName
      });

      // Structure response to include all necessary user data
      const safeUser = {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName
      };

      await setTokenCookie(res, safeUser);
      return res.status(201).json({ user: safeUser });

    } catch (err) {
      // Handle unique constraint errors
      if (err.name === 'SequelizeUniqueConstraintError') {
        const errors = {};
        if (err.errors) {
          err.errors.forEach((error) => {
            if (error.path === 'email') {
              errors.email = 'User with that email already exists';
            }
            if (error.path === 'username') {
              errors.username = 'User with that username already exists';
            }
          });
        }
        return res.status(500).json({
          message: 'User already exists',
          errors
        });
      }

      // Check for other validation errors
      if (err.name === 'SequelizeValidationError') {
        const errors = {};
        err.errors.forEach((error) => {
          errors[error.path] = error.message;
        });
        return res.status(400).json({
          message: 'Validation error',
          errors
        });
      }

      // Pass other errors to the error-handling middleware
      next(err);
    }
  }
);

module.exports = router;
