const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');
const UnAuthError = require('../errors/UnAuthError');

const auth = (req, res, next) => {
  const token = req.cookie.jwt;
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new UnAuthError('Необходима авторизация'));

    req.user = payload;

    next();
  }
};

module.exports = auth;
