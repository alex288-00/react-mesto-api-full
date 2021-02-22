const express = require('express');
const mongoose = require('mongoose');
const validator = require('validator');
const { celebrate, Joi, errors } = require('celebrate');
const bodyParser = require('body-parser');
const cors = require('cors');
const routerUsers = require('./routes/users');
const routerCards = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const urlencodedParser = bodyParser.urlencoded({ extended: true });
const { PORT = 3000 } = process.env;
const app = express();

const whiteList = [
  'localhost:3000',
  'http://mesto.alex.students.nomoreparties.space',
  'https://mesto.alex.students.nomoreparties.space',
];

// Подключаемся к Mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
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

app.use(requestLogger);

// app.use((req, res, next) => {
//   const { origin } = req.headers; // Записываем в переменную origin соответствующий заголовок

//   if (whiteList.includes(origin)) {
// Проверяем, что значение origin есть среди разрешённых доменов
//     res.header('Access-Control-Allow-Origin', origin);
//   }

//   next();
// });

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().custom((value, helper) => {
      if (validator.isEmail(value)) {
        return value;
      }
      return helper.message('Невалидный email');
    })
      .messages({
        'any.required': 'Обязательное поле',
      }),
    password: Joi.string().required().min(8).messages({
      'string.min': 'Минимум 8 символов',
      'any.required': 'Обязательное поле',
    }),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().custom((value, helper) => {
      if (validator.isEmail(value)) {
        return value;
      }
      return helper.message('Невалидный email');
    })
      .messages({
        'any.required': 'Обязательное поле',
      }),
    password: Joi.string().required().min(8).messages({
      'string.min': 'Минимум 8 символов',
      'any.required': 'Обязательное поле',
    }),
  }),
}), createUser);

app.use(auth);
// Временное решение авторизации, захардкодили id
// app.use((req, res, next) => {
//   req.user = {
//     _id: '6002fe1edd9edd2ecc23bafb',
//   };
//   next();
// });
// Роутер для пользователей
app.use('/users', routerUsers);

// Роутер для карточек
app.use('/cards', routerCards);

// Роутер для ненайденной на сервере страницы
app.use('/*', (req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

app.use(errorLogger);

app.use(errors());

// Централизованная обработка ошибок
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });
  next();
});

// Порт для нашего приложения
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
