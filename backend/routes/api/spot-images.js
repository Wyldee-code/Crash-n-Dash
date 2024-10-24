const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { SpotImage, Spot } = require('../../db/models');

const router = express.Router();

// Add an image to a spot (require authentication)
router.post('/:spotId/images', requireAuth, async (req, res) => {
  const { url, preview } = req.body;
  const spot = await Spot.findByPk(req.params.spotId);

  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  if (spot.ownerId !== req.user.id) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const newImage = await SpotImage.create({
    url,
    preview: preview || false,
    spotId: req.params.spotId,
  });

  return res.status(201).json(newImage);
});

// Get all images for a specific spot
router.get('/:spotId/images', async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId, {
    include: SpotImage,
  });

  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  return res.json(spot.SpotImages);
});

// Delete an image (require authentication)
router.delete('/images/:imageId', requireAuth, async (req, res) => {
  const image = await SpotImage.findByPk(req.params.imageId, {
    include: Spot,
  });

  if (!image) {
    return res.status(404).json({ message: "Image couldn't be found" });
  }

  if (image.Spot.ownerId !== req.user.id) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  await image.destroy();
  return res.json({ message: 'Successfully deleted' });
});

module.exports = router;
