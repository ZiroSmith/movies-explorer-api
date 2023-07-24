/* eslint-disable semi */
/* eslint-disable arrow-body-style */
/* eslint-disable consistent-return */
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
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((newUser) => {
      const { _id } = newUser;
      res.status(CREATE_CODE).send({
        _id, email, name, about, avatar,
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
      })
    })
    .catch((err) => {
      return next(err);
    });
};

// Найти всех пользователей
const getUsers = (req, res, next) => {
  return User.find({})
    .then((users) => {
      return res.status(DONE_CODE).send(users);
    })
    .catch((err) => {
      return next(err);
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
      return next(err);
    });
};

// Найти пользователя
const getUserById = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.status(DONE_CODE).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ValidationError('Ошибка валидации'));
      }
      return next(err);
    });
}

// Обновить данные пользователя
const updateUserById = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.status(DONE_CODE).send(user)
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError('Ошибка валидации'));
      }
      return next(err);
    });
};

// Обновить аватар
const updateUserAvatarById = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.status(DONE_CODE).send(user)
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError('Ошибка валидации'));
      }
      return next(err);
    });
};

module.exports = {
  getUsers,
  getMyInfo,
  getUserById,
  createUser,
  login,
  updateUserById,
  updateUserAvatarById,
};
