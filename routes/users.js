/* eslint-disable linebreak-style */
const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { REGEX } = require('../utils/constans');
const {
  getUsers, getMyInfo, getUserById, updateUserById, updateUserAvatarById,
} = require('../controllers/users');

router.get('/users', getUsers);

router.get('/users/me', getMyInfo);

router.get('/users/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().hex().length(24),
  }),
}), getUserById);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(3).max(29),
    about: Joi.string().required().min(3).max(29),
  }),
}), updateUserById);

router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    // eslint-disable-next-line no-useless-escape
    avatar: Joi.string().required().pattern(REGEX),
  }),
}), updateUserAvatarById);

module.exports = router;
