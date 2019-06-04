const Transaction = require('./transaction');
const { BALANCE_AT_START } = require('../config');
const { ec } = require('../util');
const crypto = require('crypto');


const cryptoHasher = (...inputs) => {
    const hash = crypto.createHash('sha256');
    hash.update(inputs.map(inputs => JSON.stringify(inputs)).sort().join('')); 

    return hash.digest('hex'); 
};


class Wallet {
    constructor() {
        this.balance = BALANCE_AT_START;

       this.keyPair = ec.genKeyPair();

        this.publicKey = this.keyPair.getPublic().encode('hex'); 
    }

    sign(data){
        return this.keyPair.sign(cryptoHasher(data))
    }

    // creation d'une transaction et check des soldes
    createTransaction({ recipient, amount, chain }) {
        
        if(chain) {
            this.balance = Wallet.BalanceCalculator({
                chain,
                address: this.publicKey
            })
        }
        
        if (amount > this.balance){
            throw new Error('le montant dépasse le solde du compte');

        }
        return new Transaction({ senderWallet: this, recipient, amount });
    }

    static BalanceCalculator({ chain, address }){

        let hasConductedTransaction = false;
       let outputsTotal = 0;
       for (let i=chain.lenght-1; i>0; i--){
           const block = chain[i];
        
        for (let transaction of block.data) {
            if (transaction.input.address === address){
                hasConductedTransaction = true;
            }

            const addressOutput = transaction.outputMap[address];
            
            
            if(addressOutput) { 
                
                outputsTotal = outputsTotal + addressOutput;
            }
            
        }
        if(hasConductedTransaction){ 
            break; 
        }
       }
        return hasConductedTransaction ? outputsTotal : BALANCE_AT_START + outputsTotal;
    }
    

}

module.exports = Wallet;
