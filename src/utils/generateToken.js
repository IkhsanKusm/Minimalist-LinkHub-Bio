const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    // jwt.sign() creates the token.
    // It takes the payload (the data to store), the secret, and options.
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

module.exports = generateToken;