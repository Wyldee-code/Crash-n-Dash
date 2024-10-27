const express = require('express');
const { Spot, SpotImage, User } = require('../../db/models');
const router = express.Router();

// GET all spots
router.get('/', async (req, res) => {
  const spots = await Spot.findAll({ include: { model: SpotImage, as: 'Images' } });
  res.json({ spots });
});

// GET spot details by ID
router.get('/:spotId', async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId, { include: 'Images' });
  if (spot) return res.json(spot);
  res.status(404).json({ message: 'Spot not found' });
});

// POST create new spot
router.post('/', async (req, res) => {
  const { address, city, state, country, name, description, price, ownerId } = req.body;
  const spot = await Spot.create({ address, city, state, country, name, description, price, ownerId });
  res.status(201).json(spot);
});

// PUT update a spot
router.put('/:spotId', async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);
  if (spot) {
    const { address, city, state, country, name, description, price } = req.body;
    await spot.update({ address, city, state, country, name, description, price });
    return res.json(spot);
  }
  res.status(404).json({ message: 'Spot not found' });
});

// DELETE a spot
router.delete('/:spotId', async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);
  if (spot) {
    await spot.destroy();
    return res.json({ message: 'Successfully deleted' });
  }
  res.status(404).json({ message: 'Spot not found' });
});

module.exports = router;
