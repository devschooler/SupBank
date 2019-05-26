const EC = require('eliptic').ec;
const cryptoHasher = require('./crypto-hasher');
const ec = new  EC('secp256k1');

const verifySignature = ({ publicKey, data, signature }) => {
    const keyFromPublic = ec.keyFromPublic(publicKey,'hex');

    return keyFromPublic.verify(cryptoHasher(data),signature);
};

module.exports = { ec, verifySignature };