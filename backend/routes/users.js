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

// GET-запрос данных пользователя
routerUsers.get('/me', getUser);

// GET-запрос отображает конкретного пользователя по id
routerUsers.get('/:userId', getUsersId);

// PATCH-запрос на обновление данных пользователя
routerUsers.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).messages({
      'string.min': 'Имя должно содержать не меньше 2 символов',
      'string.max': 'Имя не может быть больше 30 символов',
    }),
    about: Joi.string().min(2).max(30).messages({
      'string.min': 'Информация о себе должна содержать не меньше 2 символов',
      'string.max': 'Информация о себе должна быть больше 30 символов',
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
