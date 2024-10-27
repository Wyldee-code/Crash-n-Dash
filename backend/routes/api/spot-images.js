// routes/api/spot-images.js
const express = require('express');
const { Spot, SpotImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const router = express.Router();

// Add an image to a spot by spot ID
router.post('/:spotId/images', requireAuth, async (req, res, next) => {
  try {
    const spot = await Spot.findByPk(req.params.spotId);
    if (!spot) {
      return res.status(404).json({ message: 'Spot not found' });
    }
    if (spot.ownerId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    const { url, preview } = req.body;
    const newImage = await SpotImage.create({
      spotId: spot.id,
      url,
      preview
    });
    res.status(201).json(newImage);
  } catch (err) {
    next(err);
  }
});

// Delete an image by image ID
router.delete('/images/:imageId', requireAuth, async (req, res, next) => {
  try {
    const image = await SpotImage.findByPk(req.params.imageId);
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }
    const spot = await Spot.findByPk(image.spotId);
    if (spot.ownerId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    await image.destroy();
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
