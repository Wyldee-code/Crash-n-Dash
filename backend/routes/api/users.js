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

      // Handle validation errors with exact error structure
      if (err.name === 'SequelizeValidationError') {
        const errors = {};
        err.errors.forEach((error) => {
          switch (error.path) {
            case 'email':
              errors.email = 'Invalid email';
              break;
            case 'username':
              errors.username = 'Username is required';
              break;
            case 'firstName':
              errors.firstName = 'First Name is required';
              break;
            case 'lastName':
              errors.lastName = 'Last Name is required';
              break;
            default:
              errors[error.path] = error.message;
          }
        });
        return res.status(400).json({
          message: 'Validation error',
          errors
        });
      }

      next(err);
    }
  }
);

module.exports = router;
