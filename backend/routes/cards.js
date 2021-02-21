const { celebrate, Joi } = require('celebrate');
const routerCards = require('express').Router();
const validator = require('validator');
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

// GET-запрос отображает все карточки
routerCards.get('/', getCards);

// POST-запрос на создание новой карточки
routerCards.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required()
      .messages({
        'string.min': 'Минимум 2 символа',
        'string.max': 'Максимум 30 символов',
        'any.required': 'Обязательное поле',
      }),
    link: Joi.string().required().custom((value, helper) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helper.message('Невалидный url');
    }),
  }),
}), createCard);

// DELETE-запрос на удаление карточки
routerCards.delete('/:cardId', deleteCard);

// PUT-запрос на добавление лайка
routerCards.put('/:cardId/likes', likeCard);

// DELETE-запрос на удаление лайка
routerCards.delete('/:cardId/likes', dislikeCard);

module.exports = routerCards;
