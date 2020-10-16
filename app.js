require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');

const limiter = require('./config');
const routes = require('./routes');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const celebrateErrorHandler = require('./middlewares/celebrate-error-handler');
const errorHandler = require('./middlewares/error-handler');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mydb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'", '*'],
  },
}));
app.use(limiter);
app.use(requestLogger);
app.use(routes);
app.use(errorLogger);
app.use(celebrateErrorHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
