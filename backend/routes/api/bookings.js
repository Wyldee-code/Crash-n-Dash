const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { Booking, Spot } = require('../../db/models');
const router = express.Router();

// Create a new booking
router.post('/spots/:spotId/bookings', requireAuth, async (req, res) => {
  const { spotId } = req.params;
  const { startDate, endDate } = req.body;

  // Ensure that the spot exists
  const spot = await Spot.findByPk(spotId);
  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  // Ensure that there are no conflicting bookings
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

  // Create the booking
  const booking = await Booking.create({
    startDate,
    endDate,
    spotId,
    userId: req.user.id,
  });

  return res.status(201).json(booking);
});

// Get bookings for a specific spot
router.get('/spots/:spotId/bookings', async (req, res) => {
  const { spotId } = req.params;

  // Ensure that the spot exists
  const spot = await Spot.findByPk(spotId);
  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  // Fetch all bookings for the spot
  const bookings = await Booking.findAll({
    where: { spotId },
    include: {
      model: Spot,
      attributes: ['id', 'name'],
    },
  });

  return res.json(bookings);
});

// Get current user's bookings
router.get('/bookings/current', requireAuth, async (req, res) => {
  const bookings = await Booking.findAll({
    where: { userId: req.user.id },
    include: {
      model: Spot,
      attributes: ['id', 'name'],
    },
  });

  return res.json(bookings);
});

// Update a booking
router.put('/bookings/:bookingId', requireAuth, async (req, res) => {
  const { bookingId } = req.params;
  const { startDate, endDate } = req.body;

  // Fetch the booking
  const booking = await Booking.findByPk(bookingId);
  if (!booking) {
    return res.status(404).json({ message: "Booking couldn't be found" });
  }

  // Ensure the user owns the booking
  if (booking.userId !== req.user.id) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  // Ensure there are no conflicting bookings
  const conflictingBooking = await Booking.findOne({
    where: {
      spotId: booking.spotId,
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

  // Update the booking
  booking.startDate = startDate;
  booking.endDate = endDate;
  await booking.save();

  return res.json(booking);
});

// Delete a booking
router.delete('/bookings/:bookingId', requireAuth, async (req, res) => {
  const { bookingId } = req.params;

  // Fetch the booking
  const booking = await Booking.findByPk(bookingId);
  if (!booking) {
    return res.status(404).json({ message: "Booking couldn't be found" });
  }

  // Ensure the user owns the booking
  if (booking.userId !== req.user.id) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  // Delete the booking
  await booking.destroy();

  return res.json({ message: 'Successfully deleted' });
});

module.exports = router;
