/* eslint-disable linebreak-style */
const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, getMyInfo, getUserById, updateUserById,
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

module.exports = router;
