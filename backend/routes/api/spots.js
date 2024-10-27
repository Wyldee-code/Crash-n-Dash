// routes/api/spots.js
const express = require('express');
const { Spot, SpotImage, User } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const router = express.Router();

// Get all spots
router.get('/', async (req, res, next) => {
  try {
    const spots = await Spot.findAll({
      include: {
        model: SpotImage,
        as: 'SpotImages',
        attributes: ['url', 'preview']
      }
    });
    res.json({ spots });
  } catch (err) {
    next(err);
  }
});

// Get a spot by ID
router.get('/:spotId', async (req, res, next) => {
  try {
    const spot = await Spot.findByPk(req.params.spotId, {
      include: {
        model: SpotImage,
        as: 'SpotImages',
        attributes: ['url', 'preview']
      }
    });
    if (!spot) {
      return res.status(404).json({ message: 'Spot not found' });
    }
    res.json(spot);
  } catch (err) {
    next(err);
  }
});

// Create a new spot
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { address, city, state, country, name, description, price } = req.body;
    const spot = await Spot.create({
      ownerId: req.user.id,
      address,
      city,
      state,
      country,
      name,
      description,
      price
    });
    res.status(201).json(spot);
  } catch (err) {
    next(err);
  }
});

// Update a spot by ID
router.put('/:spotId', requireAuth, async (req, res, next) => {
  try {
    const spot = await Spot.findByPk(req.params.spotId);
    if (!spot) {
      return res.status(404).json({ message: 'Spot not found' });
    }
    if (spot.ownerId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    const { address, city, state, country, name, description, price } = req.body;
    await spot.update({ address, city, state, country, name, description, price });
    res.json(spot);
  } catch (err) {
    next(err);
  }
});

// Delete a spot by ID
router.delete('/:spotId', requireAuth, async (req, res, next) => {
  try {
    const spot = await Spot.findByPk(req.params.spotId);
    if (!spot) {
      return res.status(404).json({ message: 'Spot not found' });
    }
    if (spot.ownerId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    await spot.destroy();
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
