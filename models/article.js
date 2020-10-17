const mongoose = require('mongoose');
const isURL = require('validator/lib/isURL');

const articleSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: [true, 'Поле keyword обязательно для заполнения'],
  },
  title: {
    type: String,
    required: [true, 'Поле title обязательно для заполнения'],
  },
  text: {
    type: String,
    required: [true, 'Поле text обязательно для заполнения'],
  },
  date: {
    type: String,
    required: [true, 'Поле date обязательно для заполнения'],
  },
  source: {
    type: String,
    required: [true, 'Поле source обязательно для заполнения'],
  },
  link: {
    type: String,
    required: [true, 'Поле link обязательно для заполнения'],
    validate: {
      validator: (v) => isURL(v),
      message: 'Поле link должно быть валидным url-адресом',
    },
  },
  image: {
    type: String,
    required: [true, 'Поле image обязательно для заполнения'],
    validate: {
      validator: (v) => isURL(v),
      message: 'Поле image должно быть валидным url-адресом',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'Поле owner обязательно для заполнения'],
  },
});

articleSchema.methods.hideOwnerSalt = function () {
  const article = this.toObject();

  if (article.owner) {
    delete article.owner;
  }

  return article;
};

module.exports = mongoose.model('article', articleSchema);
