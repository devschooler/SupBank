const crypto = require('crypto'); 
//converti le hex en binaire 
//const hexToBinary = require('hex-to-binary'); 


const cryptoHasher = (...inputs) => {
    const hash = crypto.createHash('sha256');
    hash.update(inputs.map(inputs => JSON.stringify(inputs)).sort().join('')); 

    return hash.digest('hex'); 
};

module.exports = cryptoHasher; 