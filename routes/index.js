const router = require('express').Router();
const NotFoundError = require('../errors/NotFoundError');
const userRoutes = require('./users');
const movieRoutes = require('./movies');

router.use(userRoutes);
router.use(movieRoutes);

router.use('*', (req, res, next) => {
  next(new NotFoundError('Маршрут не найден'));
});

module.exports = router;
