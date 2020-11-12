require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cors = require('cors');

const limiter = require('./middlewares/limiter');
const routes = require('./routes');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorHandler = require('./middlewares/error-handler');
const { mongoDB } = require('./config');

const {
  PORT = 3000,
  NODE_ENV,
  MONGO_URI,
} = process.env;

const app = express();

mongoose.connect((NODE_ENV === 'production' && MONGO_URI) ? MONGO_URI : mongoDB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(cors({ origin: true }));

app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'", '*'],
  },
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(limiter);
app.use(requestLogger);
app.use(routes);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
