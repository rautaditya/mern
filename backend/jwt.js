const crypto = require('crypto');

function generateJwtSecret() {
  return crypto.randomBytes(64).toString('hex');
}

const jwtSecret = generateJwtSecret();
console.log('Your new JWT secret key:', jwtSecret);