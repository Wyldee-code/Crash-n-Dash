// backend/utils/auth.js
const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config');
const { User } = require('../db/models');

const { secret, expiresIn } = jwtConfig;

// Set token cookie
const setTokenCookie = (res, user) => {
  const safeUser = { id: user.id, email: user.email, username: user.username };
  const token = jwt.sign({ data: safeUser }, secret, { expiresIn: parseInt(expiresIn) });
  res.cookie('token', token, { maxAge: expiresIn * 1000, httpOnly: true });
  return token;
};

// Restore user
const restoreUser = (req, res, next) => {
  const { token } = req.cookies;
  req.user = null;
  return jwt.verify(token, secret, null, async (err, jwtPayload) => {
    if (err) return next();
    const { id } = jwtPayload.data;
    req.user = await User.findByPk(id, { attributes: { include: ['email', 'createdAt', 'updatedAt'] } });
    if (!req.user) res.clearCookie('token');
    return next();
  });
};

// Require auth
const requireAuth = (req, _res, next) => {
  if (req.user) return next();
  const err = new Error('Authentication required');
  err.status = 401;
  return next(err);
};

module.exports = { setTokenCookie, restoreUser, requireAuth };

