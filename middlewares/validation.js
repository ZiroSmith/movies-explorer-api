const { celebrate, Joi } = require('celebrate');
const { REGEX } = require('../utils/constans');

const validationSignup = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(3).max(29),
    about: Joi.string().min(3).max(29),
    // eslint-disable-next-line no-useless-escape
    avatar: Joi.string().pattern(REGEX),
  }),
});

const validationSignin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports = {
  validationSignup,
  validationSignin,
};
