const { BALANCE_AT_START } = require('../config');
const { ec } = require('../util');

class Wallet {
    constructor() {
        this.balance = BALANCE_AT_START;

        const keyPair = ec.genKeyPair();

        this.publicKey = keyPair.getPublic().encode('hex');
    }
}

module.exports = Wallet;
