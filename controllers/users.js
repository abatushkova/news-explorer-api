const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const { JWT_SECRET } = require('../config');

const getUser = (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Пользователь не найден'));
      }

      if (err.name === 'CastError') {
        next(new BadRequestError('Запрос найти пользователя не прошел валидацию'));
      }

      next(err);
    });
};

const createUser = (req, res, next) => {
  const {
    email,
    password,
    name,
  } = req.body;

  return bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    }))
    .then((user) => {
      const freshUser = user.hidePasswordSalt();

      return res.status(200).send(freshUser);
    })
    .catch((err) => {
      if (err.name === 'MongoError' || err.code === '11000') {
        next(new ConflictError('Пользователь с таким email уже создан'));
      }

      if (err.name === 'ValidationError') {
        next(new BadRequestError(`${Object.values(err.errors)
          .map((error) => error.message)
          .join(', ')
        }`));
      }

      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET);

      return res
        .cookie('jwt', token, {
          maxAge: 1000 * 60 * 60 * 24 * 7,
          httpOnly: true,
          sameSite: true,
        })
        .send({ token });
    })
    .catch(next);
};

module.exports = {
  getUser,
  createUser,
  login,
};
