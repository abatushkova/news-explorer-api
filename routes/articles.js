const router = require('express').Router();

const {
  getArticles,
  createArticle,
  deleteArticle,
} = require('../controllers/articles');
const {
  validateArticle,
  validateObjectId,
} = require('../middlewares/validators');

router.get('/', getArticles);
router.post('/', validateArticle, createArticle);
router.delete('/:id', validateObjectId, deleteArticle);

module.exports = router;
