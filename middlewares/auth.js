const jwt = require('jsonwebtoken');

const { JWT_SECRET } = require('../config');
const UnauthorizedError = require('../utils/errors/UnauthorizedError');
const { AUTHORIZATION_REQUIRED } = require('../utils/constants');

const auth = (req, res, next) => {
  let payload;

  try {
    const { authorization } = req.headers;

    if (!authorization && !authorization.startsWith('Bearer ')) {
      next(new UnauthorizedError(AUTHORIZATION_REQUIRED));
    }

    const token = authorization.replace('Bearer ', '');
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new UnauthorizedError(AUTHORIZATION_REQUIRED));
  }

  req.user = payload;

  next();
};

module.exports = auth;
