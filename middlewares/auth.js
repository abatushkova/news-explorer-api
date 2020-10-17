const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');
const UnauthError = require('../errors/UnauthError');

const auth = (req, res, next) => {
  let payload;

  try {
    const { authorization } = req.headers;

    if (!authorization && !authorization.startsWith('Bearer ')) {
      next(new UnauthError('Необходима авторизация'));
    }

    const token = authorization.replace('Bearer ', '');
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new UnauthError('Необходима авторизация'));
  }

  req.user = payload;

  next();
};

module.exports = auth;
