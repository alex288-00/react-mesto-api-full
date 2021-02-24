const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const auth = require('../middlewares/auth');
const routerUsers = require('./users');
const routerCards = require('./cards');
const NotFoundError = require('../errors/NotFoundError');
const {
  createUser,
  login,
} = require('../controllers/users');

// Регистрация
router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().custom((value, helper) => {
      if (validator.isEmail(value)) {
        return value;
      }
      return helper.message('Невалидный email');
    })
      .messages({
        'any.required': 'Заполните поле',
      }),
    password: Joi.string().required().min(3).messages({
      'string.min': 'Пароль должен быть минимум 3 символа',
      'any.required': 'Вы не ввели пароль',
    }),
  }),
}), createUser);

// Авторизация
router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().custom((value, helper) => {
      if (validator.isEmail(value)) {
        return value;
      }
      return helper.message('Невалидный email');
    })
      .messages({
        'any.required': 'Заполните поле',
      }),
    password: Joi.string().required().min(3).messages({
      'string.min': 'Пароль должен быть минимум 3 символа',
      'any.required': 'Заполните поле',
    }),
  }),
}), login);

router.use('/users', auth, routerUsers);
router.use('/cards', auth, routerCards);
router.use('/*', () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

module.exports = router;
