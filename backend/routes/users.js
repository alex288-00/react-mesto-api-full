const routerUsers = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const {
  getUsers,
  getUsersId,
  getUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

// GET-запрос отображает всех пользователей
routerUsers.get('/', getUsers);

routerUsers.get('/me', getUser);

// GET-запрос отображает конкретного пользователя по id
routerUsers.get('/:userId', getUsersId);

// POST-запрос на создание нового пользователя
// routerUsers.post('/', createUser);

// PATCH-запрос на обновление данных пользователя
routerUsers.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).messages({
      'string.min': 'Минимум 2 символа',
      'string.max': 'Максимум 30 символов',
    }),
    about: Joi.string().min(2).max(30).messages({
      'string.min': 'Минимум 2 символа',
      'string.max': 'Максимум 30 символов',
    }),
  }),
}), updateProfile);

// PATCH-запрос на обновление аватара
routerUsers.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().custom((value, helper) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helper.message('Невалидный url');
    }),
  }),
}), updateAvatar);

module.exports = routerUsers;
