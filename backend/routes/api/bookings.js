const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { Booking, Spot, SpotImage } = require('../../db/models');
const router = express.Router();

// Middleware to restore booking from bookingId param
async function restoreBooking(req, res, next) {
  const booking = await Booking.findByPk(req.params.bookingId);
  if (booking) {
    req.booking = booking;
    return next();
  }
  res.status(404).json({
    "message": "Booking couldn't be found",
    "statusCode": 404
  });
}

// Create a new booking
router.post('/spots/:spotId/bookings', requireAuth, async (req, res) => {
  const { spotId } = req.params;
  const { startDate, endDate } = req.body;

  const spot = await Spot.findByPk(spotId);
  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  // Ensure no conflicting bookings
  const conflictingBooking = await Booking.findOne({
    where: {
      spotId,
      [Op.or]: [
        { startDate: { [Op.between]: [startDate, endDate] } },
        { endDate: { [Op.between]: [startDate, endDate] } },
      ],
    },
  });

  if (conflictingBooking) {
    return res.status(403).json({
      message: 'Spot is already booked for the specified dates.',
    });
  }

  const booking = await Booking.create({
    startDate,
    endDate,
    spotId,
    userId: req.user.id,
  });

  return res.status(201).json(booking);
});

// Get current user's bookings
router.get('/bookings/current', requireAuth, async (req, res) => {
  const bookings = await Booking.findAll({
    where: { userId: req.user.id },
    include: {
      model: Spot,
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: {
        model: SpotImage,
        attributes: ['url'],
        where: { preview: true },
        required: false,
      },
    },
  });

  // Add previewImage to response
  const result = bookings.map(booking => {
    const bookingJSON = booking.toJSON();
    bookingJSON.Spot.previewImage = booking.Spot.SpotImages.length
      ? booking.Spot.SpotImages[0].url
      : null;
    delete bookingJSON.Spot.SpotImages;
    return bookingJSON;
  });

  return res.json({ Bookings: result });
});

// Update a booking
router.put('/bookings/:bookingId', requireAuth, restoreBooking, async (req, res) => {
  const { startDate, endDate } = req.body;

  if (new Date(req.booking.endDate) < new Date()) {
    return res.status(403).json({
      "message": "Past bookings can't be modified",
      "statusCode": 403
    });
  }

  // Ensure no conflicting bookings
  const conflictingBooking = await Booking.findOne({
    where: {
      spotId: req.booking.spotId,
      [Op.or]: [
        { startDate: { [Op.between]: [startDate, endDate] } },
        { endDate: { [Op.between]: [startDate, endDate] } },
      ],
    },
  });

  if (conflictingBooking) {
    return res.status(403).json({
      message: 'Spot is already booked for the specified dates.',
    });
  }

  req.booking.startDate = startDate;
  req.booking.endDate = endDate;
  await req.booking.save();

  return res.json(req.booking);
});

// Delete a booking
router.delete('/bookings/:bookingId', requireAuth, restoreBooking, async (req, res) => {
  if (new Date() > new Date(req.booking.startDate)) {
    return res.status(403).json({
      "message": "Bookings that have been started can't be deleted",
      "statusCode": 403
    });
  }

  await req.booking.destroy();
  return res.json({ message: 'Successfully deleted' });
});

module.exports = router;
