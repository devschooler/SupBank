const EC = require('elliptic').ec;
const {ec, cryptoHasher} = require('../util');


const verifySignature = ({ publicKey, data, signature }) => {
    const keyFromPublic = ec.keyFromPublic(publicKey,'hex');

    return keyFromPublic.verify(cryptoHasher(data),signature);
};

module.exports = { ec, verifySignature }; 