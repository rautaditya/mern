const jwt = require('jsonwebtoken');
const config = require('../config');

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).send('No token provided');
  }

  jwt.verify(token.split(' ')[1], config.secret, (err, decoded) => {
    if (err) {
      return res.status(500).send('Failed to authenticate token');
    }
    req.userId = decoded.id;
    next();
  });
};

module.exports = verifyToken;