/* eslint-disable linebreak-style */
const Card = require('../models/card');
const { DONE_CODE, CREATE_CODE } = require('../utils/constans');
const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

// Найти карточки
const getCards = (req, res, next) => Card.find({})
  .then((cards) => res.status(DONE_CODE).send(cards))
  .catch(next);

// Создать карточку
const createCard = (req, res, next) => {
  const { name, link } = req.body;
  return Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(CREATE_CODE).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError('Необходимо заполнить все поля ввода'));
      }
      return next(err);
    });
};

// Поставить лайк
const likeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params._id,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  // .populate('likes')
  .then((card) => {
    if (!card) {
      throw new NotFoundError('Card Not Found');
    }
    res.status(DONE_CODE).send(card);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      return next(new ValidationError('Validation Error'));
    }
    return next(err);
  });

// Убрать лайк
const dislikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params._id,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (!card) {
      throw new NotFoundError('Card Not Found');
    }
    res.status(DONE_CODE).send(card);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      return next(new ValidationError('Validation Error'));
    }
    return next(err);
  });

// Удалить карточку
const deleteCardById = (req, res, next) => {
  const cardId = req.params._id;
  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Card Not Found');
      }
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Вы не имеете права это удалить');
      }
      Card
        .findByIdAndRemove(cardId)
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
  getCards,
  createCard,
  likeCard,
  dislikeCard,
  deleteCardById,
};
