const BadRequestError = require('../utils/errors/BadRequestError');
const { PASSWORD_REQUIRED } = require('../utils/constants');

const checkPassword = (req, res, next) => {
  const { password } = req.body;

  if (!password || !password.trim()) {
    next(new BadRequestError(PASSWORD_REQUIRED));
  } else {
    next();
  }
};

module.exports = checkPassword;
