const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getMyInfo, updateUserById,
} = require('../controllers/users');

router.get('/users/me', getMyInfo);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(3).max(29),
    about: Joi.string().required().min(3).max(29),
  }),
}), updateUserById);

module.exports = router;
