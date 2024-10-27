// backend/routes/api/session.js
const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

// Validation middleware for login
const validateLogin = [
  check('credential').exists({ checkFalsy: true }).withMessage('Please provide a valid email or username.'),
  check('password').exists({ checkFalsy: true }).withMessage('Please provide a password.'),
  handleValidationErrors
];

// Login route
router.post(
  '/',
  validateLogin,
  async (req, res, next) => {
    const { credential, password } = req.body;

    // Find user by email or username
    const user = await User.unscoped().findOne({
      where: {
        [Op.or]: { username: credential, email: credential }
      }
    });

    // Handle invalid credentials
    if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
      const err = new Error('Invalid credentials');
      err.status = 401;
      err.errors = { credential: 'The provided credentials were invalid.' };
      return next(err);
    }

    // Return safe user object
    const safeUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username
    };

    // Set token cookie and respond
    await setTokenCookie(res, safeUser);
    return res.json({ user: safeUser });
  }
);

// Logout route
router.delete('/', (_req, res) => {
  res.clearCookie('token');
  return res.json({ message: 'success' });
});

// Restore session user route
router.get('/', (req, res) => {
  const { user } = req;
  if (user) {
    const safeUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username
    };
    return res.json({ user: safeUser });
  } else return res.json({ user: null });
});

module.exports = router;
