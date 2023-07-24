/* eslint-disable linebreak-style */
const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { REGEX } = require('../utils/constans');
const {
  getCards, createCard, likeCard, dislikeCard, deleteCardById,
} = require('../controllers/cards');

router.get('/cards', getCards);

router.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(3).max(29),
    // eslint-disable-next-line no-useless-escape
    link: Joi.string().required().min(3).pattern(REGEX),
  }),
}), createCard);

router.put('/cards/:_id/likes', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().required().hex().length(24),
  }),
}), likeCard);

router.delete('/cards/:_id/likes', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().required().hex().length(24),
  }),
}), dislikeCard);

router.delete('/cards/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().required().hex().length(24),
  }),
}), deleteCardById);

module.exports = router;
