const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');

// Авторизация пользователя, проверяем почту и пароль и возвращаем токен
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неправильные почта или пароль');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Неправильные почта или пароль');
          }
          return user;
        });
    })
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      next(err);
    });
};

// Поиск информации о пользователе
module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const er = new BadRequestError('Запрос неправильно сформирован');
        return next(er);
      }
      return next(err);
    });
};

// Поиск всех пользователей
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      if (!users) {
        throw new NotFoundError('Пользователи не найдены');
      }
      res.send(users);
    })
    .catch((err) => {
      next(err);
    });
};

// Поиск определенного пользователя по id
module.exports.getUsersId = (req, res, next) => {
  User.findById(req.params.userId)
    .then((users) => {
      if (!users) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      res.send(users);
    })

    .catch((err) => {
      if (err.name === 'CastError') {
        const er = new BadRequestError('Запрос неправильно сформирован');
        return next(er);
      }
      return next(err);
    });
};

// Создание пользователя
module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError('Пользователь с такие email уже зарегистрирован');
      }
      return bcrypt.hash(password, 10)
        .then((hash) => User.create({
          name, about, avatar, email, password: hash,
        }));
    })
    .then((user) => {
      res.send(
        {
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          _id: user._id,
          email: user.email,
        },
      );
    })
    .catch((err) => {
      next(err);
    });
};

// Обновление профиля
module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        throw new BadRequestError('Запрос неправильно сформирован');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const er = new BadRequestError('Запрос неправильно сформирован');
        return next(er);
      }
      return next(err);
    });
};

// Обновление аватара
module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .then((ava) => {
      if (!ava) {
        throw new BadRequestError('Запрос неправильно сформирован');
      }
      res.send(ava);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const er = new BadRequestError('Запрос неправильно сформирован');
        return next(er);
      }
      return next(err);
    });
};
