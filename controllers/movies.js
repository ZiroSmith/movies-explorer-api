const Movie = require('../models/movies');
const { DONE_CODE, CREATE_CODE } = require('../utils/constans');
const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

// Найти карточки
const getMovies = (req, res, next) => Movie.find({})
  .then((movies) => res.status(DONE_CODE).send(movies))
  .catch(next);

// Создать карточку
const createMovies = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  return Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user._id,
  })
    .then((movie) => res.status(CREATE_CODE).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError('Необходимо заполнить все поля ввода'));
      }
      return next(err);
    });
};

// Удалить карточку
const deleteMoviesById = (req, res, next) => {
  const movieId = req.params._id;
  Movie.findById(movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Card Not Found');
      }
      if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Вы не имеете права это удалить');
      }
      Movie
        .findByIdAndRemove(movieId)
        .then((user) => res.status(DONE_CODE).send(user))
        .catch((err) => {
          if (err.name === 'CastError') {
            return next(new ValidationError('Validation Error'));
          }
          return next(err);
        });
    })
    .catch(next);
};

module.exports = {
  getMovies,
  createMovies,
  deleteMoviesById,
};
