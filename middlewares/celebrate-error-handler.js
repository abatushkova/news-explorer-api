const isCelebrateError = require('celebrate');

const celebrateErrorHandler = (err, req, res, next) => {
  if (isCelebrateError(err)) {
    return res.send({ message: err.joi.message });
  }

  return next(err);
};

module.exports = celebrateErrorHandler;
