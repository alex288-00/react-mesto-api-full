const jwt = require('jsonwebtoken');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new ForbiddenError('Необходима авторизация!');
    // res.status(401).send({ message: 'Необходима авторизация' });
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    throw new ForbiddenError('Необходима авторизация!');
    // res.status(401).send({ message: 'Необходима авторизация' });
  }
  req.user = payload;
  next();
};
