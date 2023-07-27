const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { REGEX } = require('../utils/constans');
const {
  getMovies, createMovies, deleteMoviesById,
} = require('../controllers/movies');

router.get('/movies', getMovies);

router.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(REGEX),
    trailerLink: Joi.string().required().pattern(REGEX),
    thumbnail: Joi.string().required().pattern(REGEX),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovies);

router.delete('/movies/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().required().hex().length(24),
  }),
}), deleteMoviesById);

module.exports = router;
