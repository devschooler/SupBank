const uuid = require('uuid/v1');
const { verifySignature } = require('../util');
const { REWARD, MINING_REWARD } = require('../config');


class Transaction{ 
    constructor( { senderWallet, recipient, amount, outputMap, input }) {
        this.id = uuid();
        this.outputMap =  outputMap || this.createOutputMap({ senderWallet,recipient, amount});
        this.input =  input || this.createInput({ senderWallet, outputMap: this.outputMap});
    }

    createOutputMap({ senderWallet, recipient, amount }) {
        const outputMap = {};
        outputMap[recipient] = amount; 
        outputMap[senderWallet.publicKey] = senderWallet.balance - amount;

        return outputMap;
    }

    createInput({ senderWallet, outputMap }) {
        return{
            timestamp: Date.now(),
            amount : senderWallet.balance,
            address: senderWallet.publicKey,
            signature : senderWallet.sign(outputMap)

        };
    }
    // mise a jour transactions / wallet
    update({ senderWallet, recipient, amount }) {
        if (amount > this.outputMap[senderWallet.publicKey]) {
          throw new Error('Désolé ! le montant dépasse le solde du compte :( ');
        }
    
        if (!this.outputMap[recipient]) {
          this.outputMap[recipient] = amount;
        } else {
          this.outputMap[recipient] = this.outputMap[recipient] + amount;
        }
    
        this.outputMap[senderWallet.publicKey] =
          this.outputMap[senderWallet.publicKey] - amount;
    
        this.input = this.createInput({ senderWallet, outputMap: this.outputMap });
      }

    
// valider les transactions 
    static validTransaction(transaction){
        const{ input: { address, amount, signature }, outputMap} = transaction;

        const outputTotal = Object.values(outputMap).reduce((total,outputAmount) => total + outputAmount);

        if(amount !== outputTotal) {
            console.error(`transaction invalide depuis ${address}`);
            return false;
        
        }

        if(!verifySignature({ publicKey: address, data: outputMap, signature}))
        {
            console.error(`signature invalide depuis ${address}`);
            return false;
        }
        return true;
    }

    static transactionRewarder({ minerWallet }){
        return new this({
            input: REWARD,
            outputMap: { [minerWallet.publicKey]: MINING_REWARD }
        });
    }
}

module.exports = Transaction;