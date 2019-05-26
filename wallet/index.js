const { BALANCE_AT_START } = require('../config');
const { ec } = require('../util');
const cryptoHasher = require('../util/crypto-hasher');


class Wallet {
    constructor() {
        this.balance = BALANCE_AT_START;

        const keyPair = ec.genKeyPair();

        this.publicKey = this.keyPair.getPublic().encode('hex');
    }

    sign(data){
        return this.keyPair.sign(cryptoHasher(data))
    }
}

module.exports = Wallet;
