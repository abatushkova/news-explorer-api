const router = require('express').Router();

const {
  getArticles,
  createArticle,
  deleteArticle,
} = require('../controllers/articles');
const {
  validateArticle,
  validateObjectId,
} = require('../middlewares/validatiors');

router.get('/', getArticles);
router.post('/', validateArticle, createArticle);
router.delete('/:articleId', validateObjectId, deleteArticle);

module.exports = router;
