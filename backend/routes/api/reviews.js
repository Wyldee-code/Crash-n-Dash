const express = require('express');
const { Op } = require('sequelize');
const { Review, Spot, User } = require('../../db/models');
const router = express.Router();

// Get filtered reviews with pagination and date filtering
router.get('/', async (req, res) => {
  const { spotId, stars, page = 1, size = 10, startDate, endDate } = req.query;

  // Initialize filter conditions
  const where = {};

  // Add spotId filter if provided
  if (spotId) {
    where.spotId = spotId;
  }

  // Add stars filter if provided
  if (stars) {
    where.stars = stars;
  }

  // Add date filtering if provided
  if (startDate && endDate) {
    where.createdAt = {
      [Op.between]: [new Date(startDate), new Date(endDate)],
    };
  } else if (startDate) {
    where.createdAt = {
      [Op.gte]: new Date(startDate),
    };
  } else if (endDate) {
    where.createdAt = {
      [Op.lte]: new Date(endDate),
    };
  }

  // Pagination: Limit and Offset
  const limit = size > 10 ? 10 : parseInt(size);
  const offset = (page - 1) * limit;

  // Fetch filtered reviews with pagination and date filtering
  const reviews = await Review.findAndCountAll({
    where,
    limit,
    offset,
    include: [
      {
        model: Spot,
        attributes: ['id', 'name'],
      },
      {
        model: User,
        attributes: ['id', 'username'],
      }
    ]
  });

  return res.json({
    reviews: reviews.rows,
    page: parseInt(page),
    size: parseInt(size),
    totalPages: Math.ceil(reviews.count / limit),
    totalReviews: reviews.count,
  });
});

module.exports = router;
