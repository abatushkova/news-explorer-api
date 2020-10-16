const BadRequestError = require('../errors/BadRequestError');

const checkPassword = (req, res, next) => {
  const { password } = req.body;

  if (!password || !password.trim()) {
    next(new BadRequestError('Поле password обязательно для заполнения'));
  } else {
    next();
  }
};

module.exports = checkPassword;
