const express = require('express');
const { Spot, User, SpotImage, Review } = require('../../db/models');  // Import related models
const router = express.Router();

// Route 1: Get all Spots
router.get('/', async (req, res) => {
  try {
    const spots = await Spot.findAll({
      include: [{ model: SpotImage, as: 'SpotImages' }]
    });
    res.status(200).json({ Spots: spots });
  } catch (err) {
    res.status(500).json({ message: "Error fetching spots" });
  }
});


module.exports = router;
