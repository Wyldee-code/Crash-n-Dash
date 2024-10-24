const express = require('express');
const { Op } = require('sequelize'); // Sequelize operators for filtering
const { requireAuth } = require('../../utils/auth'); // Middleware for requiring authentication
const { Spot } = require('../../db/models'); // 

const router = express.Router();

// Get all spots with pagination and filtering
router.get('/', async (req, res) => {
  let { page, limit, minPrice, maxPrice, name } = req.query;

  // Default pagination settings
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 20;

  if (page < 1) page = 1;
  if (limit < 1 || limit > 100) limit = 20;

  const offset = (page - 1) * limit;

  // Build filtering conditions
  const where = {};

  if (minPrice) {
    where.price = { [Op.gte]: parseFloat(minPrice) };
  }
  if (maxPrice) {
    if (!where.price) where.price = {};
    where.price[Op.lte] = parseFloat(maxPrice);
  }

  if (name) {
    where.name = { [Op.iLike]: `%${name}%` }; // Partial match, case-insensitive
  }

  const spots = await Spot.findAndCountAll({
    where,
    limit,
    offset
  });

  return res.json({
    spots: spots.rows,
    page,
    limit,
    totalSpots: spots.count,
    totalPages: Math.ceil(spots.count / limit)
  });
});

// Get spot details by spotId
router.get('/:spotId', async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }
  return res.json(spot);
});

// Create a new spot (require authentication)
router.post('/', requireAuth, async (req, res) => {
  const { name, description, price } = req.body; // Example spot fields
  const spot = await Spot.create({
    name,
    description,
    price,
    ownerId: req.user.id, // Set owner from the authenticated user
  });
  return res.status(201).json(spot);
});

// Update an existing spot (require authentication and ownership)
router.put('/:spotId', requireAuth, async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }
  if (spot.ownerId !== req.user.id) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  const { name, description, price } = req.body;
  spot.name = name;
  spot.description = description;
  spot.price = price;
  await spot.save();
  return res.json(spot);
});

// Delete an existing spot (require authentication and ownership)
router.delete('/:spotId', requireAuth, async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }
  if (spot.ownerId !== req.user.id) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  await spot.destroy();
  return res.json({ message: 'Successfully deleted' });
});

module.exports = router;
