const router = require('express').Router();

const userRouter = require('./users');
const articleRouter = require('./articles');
const auth = require('../middlewares/auth');
const checkPassword = require('../middlewares/check-password');
const { createUser, login } = require('../controllers/users');
const { validateUser, validateAuth } = require('../middlewares/validatiors');

router.post('/signup', validateUser, checkPassword, createUser);
router.post('/signin', validateAuth, checkPassword, login);
router.use(auth);
router.use('/users', userRouter);
router.use('/articles', articleRouter);

module.exports = router;
