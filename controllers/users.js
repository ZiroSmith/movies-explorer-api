const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;
const { DONE_CODE, CREATE_CODE } = require('../utils/constans');
const NotFoundError = require('../errors/NotFoundError');
const DuplicateError = require('../errors/DuplicateError');
const ValidationError = require('../errors/ValidationError');
const AuthorizationError = require('../errors/AuthorizationError');

// Создать юзера - регистрация:
const createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    }))
    .then((newUser) => {
      const { _id } = newUser;
      res.status(CREATE_CODE).send({
        _id, email, name,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError('Ошибка валидации'));
      }
      if (err.code === 11000) {
        return next(new DuplicateError('Такой email уже существует'));
      }
      return next(err);
    });
};

// Авторизация:
const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthorizationError('Такого пользователя не существует');
      }
      bcrypt.compare(password, user.password, (err, isPasswordMatch) => {
        if (!isPasswordMatch) {
          return next(new AuthorizationError('Неправильный логин или пароль'));
        }
        const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
        return res.status(DONE_CODE).send({ token });
      });
    })
    .catch((err) => {
      next(err);
    });
};

const getMyInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.send(user);
    })
    .catch((err) => {
      next(err);
    });
};

// Обновить данные пользователя
const updateUserById = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.status(DONE_CODE).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError('Ошибка валидации'));
      }
      return next(err);
    });
};

module.exports = {
  getMyInfo,
  createUser,
  login,
  updateUserById,
};
