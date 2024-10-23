
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
