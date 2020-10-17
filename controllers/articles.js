const Article = require('../models/article');

const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

const getArticles = (req, res, next) => {
  Article.find({ owner: req.user._id })
    .populate('owner')
    .then((articles) => res.status(200).send(articles))
    .catch(next);
};

const createArticle = (req, res, next) => {
  const {
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
  } = req.body;

  Article.create({
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
    owner: req.user._id,
  })
    .then((article) => {
      const freshArticle = article.hideOwnerSalt();

      return res.status(200).send(freshArticle);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(`${Object.values(err.errors)
          .map((error) => error.message)
          .join(', ')
        }`));
      }

      next(err);
    });
};

const deleteArticle = (req, res, next) => {
  const owner = req.user._id;

  Article.findOne({ _id: req.params.id })
    .orFail()
    .then((article) => {
      if (String(article.owner) !== owner) {
        next(new ForbiddenError('У вас нет прав на удаление статьи'));
      } else {
        Article.deleteOne(article)
          .then(() => res.status(200).send(article));
      }
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Нет статьи с таким id'));
      }

      if (err.name === 'CastError') {
        next(new BadRequestError('Невалидный id статьи'));
      }

      next(err);
    });
};

module.exports = {
  getArticles,
  createArticle,
  deleteArticle,
};
