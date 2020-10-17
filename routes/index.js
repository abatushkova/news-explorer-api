const router = require('express').Router();

const userRouter = require('./users');
const articleRouter = require('./articles');
const auth = require('../middlewares/auth');
const checkPassword = require('../middlewares/check-password');
const { createUser, login } = require('../controllers/users');
const { validateUser, validateAuth } = require('../middlewares/validators');
const NotFoundError = require('../errors/NotFoundError');

router.post('/signup', validateUser, checkPassword, createUser);
router.post('/signin', validateAuth, checkPassword, login);
router.use(auth);
router.use('/users', userRouter);
router.use('/articles', articleRouter);

router.use((req, res, next) => {
  next(new NotFoundError('Запрашиваемая страница не найдена'));
});

module.exports = router;
