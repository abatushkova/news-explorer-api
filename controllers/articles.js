const Article = require('../models/article');
const BadRequestError = require('../utils/errors/BadRequestError');
const NotFoundError = require('../utils/errors/NotFoundError');
const ForbiddenError = require('../utils/errors/ForbiddenError');
const {
  NO_RIGHTS_ERROR,
  ARTICLE_NOT_FOUND,
  ARTICLE_ID_NOT_VALID,
} = require('../utils/constants');

const getArticles = (req, res, next) => {
  Article.find({ owner: req.user._id })
    .populate('owner')
    .then((articles) => res.send(articles))
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

      return res.status(201).send(freshArticle);
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
        next(new ForbiddenError(NO_RIGHTS_ERROR));
      } else {
        Article.deleteOne(article)
          .then(() => res.send(article));
      }
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError(ARTICLE_NOT_FOUND));
      }

      if (err.name === 'CastError') {
        next(new BadRequestError(ARTICLE_ID_NOT_VALID));
      }

      next(err);
    });
};

module.exports = {
  getArticles,
  createArticle,
  deleteArticle,
};
