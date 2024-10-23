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

// Route 2: Get all Spots owned by the Current User
router.get('/current', async (req, res) => {
  const { user } = req;  // Assuming req.user contains the authenticated user
  if (!user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const spots = await Spot.findAll({
      where: { ownerId: user.id },
      include: [{ model: SpotImage, as: 'SpotImages' }]
    });
    res.status(200).json({ Spots: spots });
  } catch (err) {
    res.status(500).json({ message: "Error fetching user's spots" });
  }
});

// Route 3: Get details of a Spot from an id
router.get('/:spotId', async (req, res) => {
  const spotId = req.params.spotId;
  try {
    const spot = await Spot.findByPk(spotId, {
      include: [
        { model: SpotImage, as: 'SpotImages' },
        { model: Review },
        { model: User, as: 'Owner' }
      ]
    });

    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    res.status(200).json(spot);
  } catch (err) {
    res.status(500).json({ message: "Error fetching spot details" });
  }
});

// Route 4: Create a Spot
router.post('/', async (req, res) => {
  const { address, city, state, country, lat, lng, name, description, price } = req.body;
  const { user } = req;  // Assuming req.user contains the authenticated user
  if (!user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const newSpot = await Spot.create({
      ownerId: user.id,
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price
    });
    res.status(201).json(newSpot);
  } catch (err) {
    res.status(400).json({ message: "Bad Request", errors: err.errors });
  }
});

// Route 5: Add an Image to a Spot based on the Spot's id
router.post('/:spotId/images', async (req, res) => {
  const spotId = req.params.spotId;
  const { url, preview } = req.body;
  const { user } = req;  // Assuming req.user contains the authenticated user

  try {
    const spot = await Spot.findByPk(spotId);

    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    if (spot.ownerId !== user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const newImage = await SpotImage.create({
      spotId: spot.id,
      url,
      preview
    });
    res.status(201).json(newImage);
  } catch (err) {
    res.status(500).json({ message: "Error adding image to spot" });
  }
});

// Route 6: Edit a Spot
router.put('/:spotId', async (req, res) => {
  const spotId = req.params.spotId;
  const { address, city, state, country, lat, lng, name, description, price } = req.body;
  const { user } = req;

  try {
    const spot = await Spot.findByPk(spotId);

    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    if (spot.ownerId !== user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Update spot details
    spot.address = address;
    spot.city = city;
    spot.state = state;
    spot.country = country;
    spot.lat = lat;
    spot.lng = lng;
    spot.name = name;
    spot.description = description;
    spot.price = price;

    await spot.save();
    res.status(200).json(spot);
  } catch (err) {
    res.status(400).json({ message: "Bad Request", errors: err.errors });
  }
});

// Route 7: Delete a Spot
router.delete('/:spotId', async (req, res) => {
  const spotId = req.params.spotId;
  const { user } = req;

  try {
    const spot = await Spot.findByPk(spotId);

    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    if (spot.ownerId !== user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await spot.destroy();
    res.status(200).json({ message: "Successfully deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting spot" });
  }
});

module.exports = router;
