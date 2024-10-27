const express = require('express');
const { SpotImage, Spot } = require('../../db/models');
const router = express.Router();

// POST add an image to a spot
router.post('/:spotId/images', async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) return res.status(404).json({ message: 'Spot not found' });

  const { url, preview } = req.body;
  const spotImage = await SpotImage.create({ spotId: spot.id, url, preview });
  res.status(201).json(spotImage);
});

module.exports = router;
