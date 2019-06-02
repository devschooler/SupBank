const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const crypto = require('crypto');


const cryptoHasher = (...inputs) => {
    const hash = crypto.createHash('sha256');
    hash.update(inputs.map(inputs => JSON.stringify(inputs)).sort().join('')); 

    return hash.digest('hex'); 
};

const verifySignature = ({ publicKey, data, signature }) => {
    const keyFromPublic = ec.keyFromPublic(publicKey,'hex');

    return keyFromPublic.verify(cryptoHasher(data),signature);
};

module.exports = { ec, verifySignature }; 