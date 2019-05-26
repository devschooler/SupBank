const Transaction = require('./transaction');
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

    // creation d'une transaction et check des soldes
    createTransaction({ recipient, amount }) {
        if (amount > this.balance){
            throw new Error('le montant dépasse le solde du compte');

        }
        return new Transaction({ senderWallet: this, recipient, amount });
    }

    

}

module.exports = Wallet;
