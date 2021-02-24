const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');

// Поиск всех карточек
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
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
      res.send(card);
    })
    .catch((err) => {
      next(err);
    });
};

// Удаление карточки
module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      if (String(card.owner) !== String(req.user._id)) {
        throw new BadRequestError('Можно удалить только свой пост');
      }
      Card.findByIdAndRemove(card._id)
        .then(() => {
          res.send({ message: 'Пост удален' });
        });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const er = new BadRequestError('Запрос неправильно сформирован');
        return next(er);
      }
      return next(err);
    });
};

// Ставим лайк карточке
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const er = new BadRequestError('Запрос неправильно сформирован');
        return next(er);
      }
      return next(err);
    });
};

// Удаляем лайк
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const er = new BadRequestError('Запрос неправильно сформирован');
        return next(er);
      }
      return next(err);
    });
};
