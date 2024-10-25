const express = require('express');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { validateSignup, analyzeErrors } = require('../api/validators.js');

const router = express.Router();

// Sign up a new user
router.post('/', validateSignup, async (req, res) => {
  analyzeErrors(req, res, async () => {
    const { email, password, username, firstName, lastName } = req.body;

    // Ensure that email and username are unique
    const existingUser = await User.findOne({
      where: {
        email
      }
    });

    if (existingUser) {
      return res.status(403).json({
        message: "User with that email already exists",
        statusCode: 403,
      });
    }

    // Sign up the user using User model's signup method
    const user = await User.signup({
      email,
      username,
      password,
      firstName,
      lastName
    });

    // Set token cookie for the user
    const token = setTokenCookie(res, user);

    // Respond with the user's safe object and token
    return res.json({
      ...user.toSafeObject(),
      token
    });
  });
});

// Get the current user
router.get('/current', requireAuth, (req, res) => {
  const { user } = req;

  if (user) {
    return res.json({
      ...user.toSafeObject()
    });
  } else {
    return res.json(null);
  }
});

module.exports = router;
