const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const NotFoundError = require('../utils/errors/NotFoundError');
const BadRequestError = require('../utils/errors/BadRequestError');
const ConflictError = require('../utils/errors/ConflictError');
const {
  USER_NOT_FOUND,
  USER_ID_NOT_VALID,
  USER_ALREADY_EXISTS,
} = require('../utils/constants');
const { JWT_SECRET } = require('../config');

const getUser = (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError(USER_NOT_FOUND));
      }

      if (err.name === 'CastError') {
        next(new BadRequestError(USER_ID_NOT_VALID));
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

      return res.status(201).send(freshUser);
    })
    .catch((err) => {
      if (err.name === 'MongoError' || err.code === '11000') {
        next(new ConflictError(USER_ALREADY_EXISTS));
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
      const token = jwt.sign(
        { _id: user._id },
        JWT_SECRET,
        { expiresIn: '7d' },
      );

      return res.send({ token });
    })
    .catch(next);
};

module.exports = {
  getUser,
  createUser,
  login,
};
