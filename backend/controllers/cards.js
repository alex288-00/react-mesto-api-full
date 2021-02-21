const mongoose = require('mongoose');
const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');

// Поиск всех карточек
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      if (!cards) {
        throw new NotFoundError('Карточка не найдена');
      }
      res.send({ data: cards });
    })
    .catch((err) => {
      next(err);
    });
};

// Создание карточки
module.exports.createCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then((card) => {
      if (!card) {
        throw new BadRequestError('Запрос неправильно сформирован');
      }
      res.send({ data: card });
    })
    .catch((err) => {
      next(err);
    });
};

// Удаление карточки
module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (String(card.owner) !== String(req.user._id)) {
        throw new BadRequestError('Карточка не удалена');
      }
      Card.findByIdAndRemove(card._id)
        .then(() => {
          res.send({ message: 'delete' });
        });
    })
    .catch((err) => {
      next(err);
    });
};

// Ставим лайк карточке
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(() => {
      throw new Error('404');
    })
    .then((like) => res.send({ data: like }))
    .catch((err) => {
      if (err.message === '404') {
        return res.status(404).send({ message: 'Карточка не найдена' });
      }
      if (err instanceof mongoose.CastError) {
        return res.status(400).send({ message: 'Запрос неправильно сформирован' });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

// Удаляем лайк
module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(() => {
      throw new Error('404');
    })
    .then((dislike) => res.send({ data: dislike }))
    .catch((err) => {
      if (err.message === '404') {
        return res.status(404).send({ message: 'Карточка не найдена' });
      }
      if (err instanceof mongoose.CastError) {
        return res.status(400).send({ message: 'Запрос неправильно сформирован' });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};
