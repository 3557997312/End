const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config/config');

function generateToken(UserID, Role) {
  const token = jwt.sign({ UserID, Role }, SECRET_KEY, { algorithm: 'HS256' });
  return token;
}

module.exports = { generateToken };
