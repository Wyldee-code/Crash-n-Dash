const express = require('express');

const { setTokenCookie, restoreUser, requireAuthentication } = require('../../utils/auth');
const { User } = require('../../db/models');

const { check } = require('express-validator');
const { validateLogin, analyzeErrors } = require('../api/validators.js');

const router = express.Router();

// Log in
router.post('/', validateLogin, async (req, res, next) => {
    analyzeErrors(req, res, async () => {
        const { credential, password } = req.body;

        const user = await User.login({ credential, password });

        if (!user) {
            return res.status(401).json({
                "message": "Invalid credentials",
                "statusCode": 401
            })
        }

        const token = setTokenCookie(res, user);

        return res.json({ ...user.toJSON(), token });
    })
});

// Log out
router.delete('/', (_req, res) => {
    res.clearCookie('token');
    return res.json({ message: 'success' });
});

// Restore session user
router.get('/', requireAuthentication, (req, res) => {
    res.json(req.user.toSafeObject());
});

module.exports = router;
