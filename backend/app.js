const express = require('express');
const mongoose = require('mongoose');
const { CelebrateError } = require('celebrate');
const bodyParser = require('body-parser');
const cors = require('cors');
const router = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const urlencodedParser = bodyParser.urlencoded({ extended: true });
const { PORT = 3000 } = process.env;
const app = express();

// Адреса для CORS
const whiteList = [
  'http://localhost:3000',
  'http://mesto.alex.students.nomoreparties.space',
  'https://mesto.alex.students.nomoreparties.space',
];

// Подключаемся к Mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const corsOptionsDelegate = (req, callback) => {
  let corsOptions;
  if (whiteList.indexOf(req.header('Origin')) !== -1) {
    corsOptions = {
      credentials: true, // This is important.
      origin: true,
    }; // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false }; // disable CORS for this request
  }
  callback(null, corsOptions); // callback expects two parameters: error and options
};

app.use(bodyParser.json());
app.use(urlencodedParser);

app.use(cors(corsOptionsDelegate));

// Логи запросов
app.use(requestLogger);

// Crash Test
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use('/', router);

// Логи ошибок
app.use(errorLogger);

// Централизованная обработка ошибок
// eslint-disable-next-line consistent-return
app.use((err, req, res, next) => {
  if (err instanceof CelebrateError) {
    return res.status(400).send({ message: err.details.get('body').details[0].message });
  }
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });
  next();
});

// Порт для нашего приложенияxxz
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
