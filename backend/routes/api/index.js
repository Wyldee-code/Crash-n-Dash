const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const { restoreUser } = require("../../utils/auth.js");
const spotsRouter = require('./spots.js');
const spotImagesRouter = require('./spot-images');
const reviewsRouter = require('./reviews');
const bookingsRouter = require('./bookings');


router.use(restoreUser);

router.use('/session', sessionRouter);

router.use('/users', usersRouter);

router.use('/spots', spotsRouter);

router.use('/spot-images', spotImagesRouter);

router.use('/reviews', reviewsRouter);

router.use('/bookings', bookingsRouter);

router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});

module.exports = router;
