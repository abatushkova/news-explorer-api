const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');
const bcrypt = require('bcrypt');

const UnAuthError = require('../errors/UnAuthError');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Поле email обязательно для заполнения'],
    unique: true,
    validate: {
      validator: (v) => isEmail(v),
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    required: [true, 'Поле password обязательно для заполнения'],
    select: false,
  },
  name: {
    type: String,
    required: [true, 'Поле name обязательно для заполнения'],
    minlength: [2, 'Минимальное количество символов: 2'],
    maxlength: [30, 'Максимальное количество символов: 30'],
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnAuthError('Передан неверный логин или пароль');
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnAuthError('Передан неверный логин или пароль');
          }

          return user;
        });
    });
};

userSchema.methods.hidePasswordSalt = function () {
  const user = this.toObject();

  if (user.password) {
    delete user.password;
  }

  return user;
};

module.exports = mongoose.model('user', userSchema);
