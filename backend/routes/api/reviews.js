const express = require('express');
const { Review, User, Spot, ReviewImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { check, validationResult } = require('express-validator');
const router = express.Router();

// Validation for review data
const validateReview = [
  check('review').exists({ checkFalsy: true }).withMessage('Review text is required'),
  check('stars').isInt({ min: 1, max: 5 }).withMessage('Stars must be an integer from 1 to 5'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation error', errors: errors.mapped() });
    }
    next();
  },
];

// Get all reviews of the current user
router.get('/current', requireAuth, async (req, res) => {
  const reviews = await Review.findAll({
    where: { userId: req.user.id },
    include: [{ model: Spot }, { model: ReviewImage }],
  });
  res.json({ reviews });
});

// Create a review for a spot by ID
router.post('/:spotId', requireAuth, validateReview, async (req, res) => {
  const { spotId } = req.params;
  const { review, stars } = req.body;

  const spot = await Spot.findByPk(spotId);
  if (!spot) return res.status(404).json({ message: "Spot couldn't be found" });

  const newReview = await Review.create({
    userId: req.user.id,
    spotId,
    review,
    stars,
  });

  res.status(201).json(newReview);
});

// Edit a review by ID
router.put('/:reviewId', requireAuth, validateReview, async (req, res) => {
  const { reviewId } = req.params;
  const { review, stars } = req.body;

  const existingReview = await Review.findByPk(reviewId);
  if (!existingReview) return res.status(404).json({ message: "Review couldn't be found" });

  if (existingReview.userId !== req.user.id) return res.status(403).json({ message: 'Forbidden' });

  existingReview.review = review;
  existingReview.stars = stars;
  await existingReview.save();

  res.json(existingReview);
});

// Delete a review by ID
router.delete('/:reviewId', requireAuth, async (req, res) => {
  const { reviewId } = req.params;

  const review = await Review.findByPk(reviewId);
  if (!review) return res.status(404).json({ message: "Review couldn't be found" });

  if (review.userId !== req.user.id) return res.status(403).json({ message: 'Forbidden' });

  await review.destroy();
  res.json({ message: 'Successfully deleted' });
});

module.exports = router;
