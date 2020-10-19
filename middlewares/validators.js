const { celebrate, Joi } = require('celebrate');
const { ObjectId } = require('mongoose').Types;
const isURL = require('validator/lib/isURL');
const isEmail = require('validator/lib/isEmail');

const validateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom((value, helpers) => {
      if (isEmail(value)) {
        return value;
      }

      return helpers.message('Неправильный формат почты');
    }),
    password: Joi.string().required(),
    name: Joi.string().required().min(2).max(30)
      .messages({
        'string.min': 'Минимальное количество символов в поле name: 2',
        'string.max': 'Максимальное количество символов в поле name: 30',
      }),
  }),
}, {
  abortEarly: false,
  messages: {
    'string.empty': 'Поле {#label} не должно быть пустым',
    'any.required': 'Поле {#label} обязательно для заполнения',
  },
});

const validateArticle = celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().required().custom((value, helpers) => {
      if (isURL(value)) {
        return value;
      }

      return helpers.message('Поле link должно быть валидным url-адресом');
    }),
    image: Joi.string().required().custom((value, helpers) => {
      if (isURL(value)) {
        return value;
      }

      return helpers.message('Поле image должно быть валидным url-адресом');
    }),
  }),
}, {
  abortEarly: false,
  messages: {
    'string.empty': 'Поле {#label} не должно быть пустым',
    'any.required': 'Поле {#label} обязательно для заполнения',
  },
});

const validateObjectId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().custom((value, helpers) => {
      if (ObjectId.isValid(value)) {
        return value;
      }

      return helpers.message('Невалидный id');
    }),
  }),
});

const validateAuth = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom((value, helpers) => {
      if (isEmail(value)) {
        return value;
      }

      return helpers.message('Неправильный формат почты');
    }),
    password: Joi.string().required(),
  }),
}, {
  abortEarly: false,
  messages: {
    'string.empty': 'Поле {#label} не должно быть пустым',
    'any.required': 'Поле {#label} обязательно для заполнения',
  },
});

module.exports = {
  validateUser,
  validateArticle,
  validateObjectId,
  validateAuth,
};
