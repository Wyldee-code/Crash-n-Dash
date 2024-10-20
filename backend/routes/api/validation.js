const { check, validationResult } = require('express-validator');
const { query } = require('express-validator/check');
const { Booking, sequelize, User } = require('../../db/models');
const { Op } = require("sequelize");

async function analyzeErrors(req, res, validHandler) {
    const errorObjects = validationResult(req);
    if (errorObjects.isEmpty()) {
        return await validHandler();
    }
    else {
        const errors = errorObjects.array().reduce((errors, errObj) => {
            errors[errObj.param] = errObj.msg;
            return errors;
        }, {});
        res.status(req.status || 400).json({
            message: req.message || "Validation Error",
            statusCode: req.status || 400,
            errors
        });
    }
}

const validateSignup = [
    check('email')
        .custom(async (email, { req }) => {
            const user = await User.findOne({ where: { email } });
            if (user) {
                req.message = "User already exists"
                req.status = 403;
                throw new Error('User with that email already exists');
            } else {
                return email;
            }
        })
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage('Invalid email')
        .isLength({ min: 3, max: 256 })
        .withMessage('Email length must be at least 3 characters and no more than 256.'),
    check('username')
        .custom(async (username, { req }) => {
            const user = await User.findOne({ where: { username } });
            if (user) {
                req.message = "User already exists"
                req.status = 403;
                throw new Error('User with that username already exists');
            } else {
                return username;
            }
        })
        .exists({ checkFalsy: true })
        .withMessage('Username is required')
        .not()
        .isEmail()
        .withMessage('Username cannot be an email.')
        .isLength({ min: 4, max: 30 })
        .withMessage('Username length must be at least 4 characters and no more than 30')
    ,
    check('firstName')
        .exists()
        .withMessage("First Name is required")
        .not()
        .isEmail()
        .withMessage('First name cannot be an email.')
        .isLength({ max: 30 })
        .withMessage('firstName length can be no more than 30'),
    check('lastName')
        .exists()
        .withMessage("Last Name is required")
        .not()
        .isEmail()
        .withMessage('Last name cannot be an email.')
        .isLength({ max: 30 })
        .withMessage('lastName length can be no more than 30'),
    check('password')
        .exists({ checkFalsy: true })
        .isLength({ min: 6 })
        .withMessage('Password must be 6 characters or more.'),
];

const validateLogin = [
    check('credential')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Email or username is required'),
    check('password')
        .exists({ checkFalsy: true })
        .withMessage('Password is required')
];

const validateSpot = [
    check('address')
        .exists({ checkFalsy: true })
        .withMessage('Street address is required'),
    check('city')
        .exists({ checkFalsy: true })
        .withMessage('City is required'),
    check('state')
        .exists({ checkFalsy: true })
        .withMessage('State is required'),
    check('country')
        .exists({ checkFalsy: true })
        .withMessage('Country is required'),
    check('lat')
        .exists({ checkFalsy: true })
        .withMessage('Latitude is not valid'),
    check('lng')
        .exists({ checkFalsy: true })
        .withMessage('Longitude is required'),
    check('name')
        .exists({ checkFalsy: true })
        .withMessage('Name is required')
        .isLength({ max: 100 })
        .withMessage('Name must be less than 100 characters'),
    check('description')
        .exists({ checkFalsy: true })
        .withMessage('Description is required'),
    check('price')
        .exists({ checkFalsy: true })
        .withMessage('Price per day is required')
        .isFloat({ min: 0 })
        .withMessage('Price must be a non-negative number')
];

const validateSpotQuery = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage("Page must be greater than or equal to 1")
        .isInt({ max: 10 })
        .withMessage("Page must be less than or equal to 10"),
    query('size')
        .optional()
        .isInt({ min: 1 })
        .withMessage("Size must be greater than or equal to 1")
        .isInt({ max: 10 })
        .withMessage("Size must be less than or equal to 20"),
    query('minLat')
        .optional()
        .isFloat()
        .withMessage("Minimum latitude is invalid"),
    query('maxLat')
        .optional()
        .isFloat()
        .withMessage("Maximum latitude is invalid"),
    query('minLng')
        .optional()
        .isFloat()
        .withMessage("Minimum longitude is invalid"),
    query('maxLng')
        .optional()
        .isFloat()
        .withMessage("Maximum longitude is invalid"),
    query('minPrice')
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Minimum price must be greater than or equal to 0"),
    query('maxPrice')
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Maximum price must be greater than or equal to 0"),
];

const validateReview = [
    check('review')
        .exists({ checkFalsy: true })
        .withMessage('Review text is required'),
    check('stars')
        .isIn([1, 2, 3, 4, 5])
        .withMessage('Stars must be an integer from 1 to 5')
];

const validateBooking = [
    check('endDate')
        .custom((endDate, { req }) => {
            if (new Date(endDate) <= new Date(req.body.startDate)) {
                throw new Error('endDate cannot be on or before startDate');
            } else {
                return endDate;
            }
        })
        .custom(async (endDate, { req }) => {
            const options = { where: {} };
            if (req.booking) {
                options.where.id = { [Op.not]: req.booking.id };
                options.spotId = req.booking.spotId;
            } else {
                options.spotId = req.params.spotId;
            }
            const bookings = await Booking.findAll(options);
            for (const booking of bookings) {
                if (new Date(endDate) >= new Date(booking.startDate) && new Date(endDate) <= new Date(booking.endDate)) {
                    req.message = "Sorry, this spot is already booked for the specified dates";
                    req.status = 403;
                    throw new Error("End date conflicts with an existing booking");
                }
            }
            return endDate;
        }),
    check('startDate')
        .custom(async (startDate, { req }) => {
            const options = { where: {} };
            if (req.booking) {
                options.where.id = { [Op.not]: req.booking.id };
                options.spotId = req.booking.spotId;
            } else {
                options.spotId = req.params.spotId;
            }
            const bookings = await Booking.findAll(options);
            for (const booking of bookings) {
                if (new Date(startDate) >= new Date(booking.startDate) && new Date(startDate) <= new Date(booking.endDate)) {
                    req.message = "Sorry, this spot is already booked for the specified dates";
                    req.status = 403;
                    throw new Error("Start date conflicts with an existing booking");
                }
            }
            return startDate;
        })
];

module.exports = {
    analyzeErrors,
    validateSpot,
    validateLogin,
    validateReview,
    validateSignup,
    validateBooking,
    validateSpotQuery
}
