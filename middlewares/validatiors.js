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
    })
      .messages({
        'string-required': 'Поле email обязательно для заполнения',
      }),
    password: Joi.string().required().messages({
      'string.reqired': 'Поле password обязательно для заполнения',
    }),
    name: Joi.string().required().min(2).max(30)
      .messages({
        'string.required': 'Поле name обязательно для заполнения',
        'string.min': 'Минимальное количество символов: 2',
        'string.max': 'Максимальное количество символов: 30',
      }),
  }),
});

const validateArticle = celebrate({
  body: Joi.object().keys({
    keywords: Joi.string().required()
      .messages({
        'string.required': 'Поле keyword обязательно для заполнения',
      }),
    title: Joi.string().required()
      .messages({
        'string.required': 'Поле title обязательно для заполнения',
      }),
    text: Joi.string().required()
      .messages({
        'string.required': 'Поле text обязательно для заполнения',
      }),
    date: Joi.string().required()
      .messages({
        'string.required': 'Поле date обязательно для заполнения',
      }),
    source: Joi.string().required()
      .messages({
        'string.required': 'Поле source обязательно для заполнения',
      }),
    link: Joi.string().required().custom((value, helpers) => {
      if (isURL(value)) {
        return value;
      }

      return helpers.message('Поле link должно быть валидным url-адресом');
    })
      .messages({
        'string-required': 'Поле link обязательно для заполнения',
      }),
    iamge: Joi.string().required().custom((value, helpers) => {
      if (isURL(value)) {
        return value;
      }

      return helpers.message('Поле image должно быть валидным url-адресом');
    })
      .messages({
        'string-required': 'Поле image обязательно для заполнения',
      }),
  }),
});

const validateObjectId = celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().required().custom((value, helpers) => {
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
    })
      .messages({
        'string-required': 'Поле email обязательно для заполнения',
      }),
    password: Joi.string().required().messages({
      'string.reqired': 'Поле password обязательно для заполнения',
    }),
  }),
});

module.exports = {
  validateUser,
  validateArticle,
  validateObjectId,
  validateAuth,
};
