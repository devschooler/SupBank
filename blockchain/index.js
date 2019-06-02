const Block = require('./block'); 
const Transaction = require('../wallet/transaction');
const Wallet = require('../wallet');
const {cryptoHasher} = require('../util');
const { REWARD, MINING_REWARD } = require('../config');

class Blockchain { 
    constructor() { 
    this.chain = [Block.genesis()];
}

addBlock({ data }) { 
    const newBlock = Block.blockMiner({
        lastBlock: this.chain[this.chain.length-1],
        data
    }); 
    this.chain.push(newBlock); 
    }

    chainReplacer(chain, onSuccess) { 
        if (chain.length <= this.chain.length) {
            console.error('la chaine entrante est trop courte')
            return;
        }

        if (!Blockchain.ChainValidator(chain)){
            console.error('la chaine entrante dois etre valide')
            return; 
        }
        if (onSuccess) onSuccess(); 

        console.log('remplacement de chaine par ', chain);
        this.chain = chain; 


    }

    validTransactionData({ chain }) {
        for(let i=1; i<chain.length; i++){ 
            const block = chain[i];
            const TransactionSet = new Set();
            let rewardTransactionCount = 0; 

            for (let transaction of block.data){ 
                if(transaction.input.address === REWARD.ADDRESS){
                    rewardTransactionCount += 1;

                    if(rewardTransactionCount > 1 ){
                         console.error(`la reward du miner dépasse la limite`);
                         return false;
                    }

                    if(Object.values(transaction.outputMap)[0] !== MINING_REWARD){
                        console.error('la récompense du miner ');
                        return false;
                    }
                }

                else { 
                    if(!Transaction.validTransaction(transaction)){
                        console.error('transaction invalide');
                        return false;
                    }

                    const trueBalance = Wallet.BalanceCalculator({ 
                        chain: this.chain,
                        address: transaction.input.address
                    });

                    if(transaction.input.amount !== trueBalance ){
                        console.error('montant entree invalide');
                        return false;
                    }

                    if(TransactionSet.has(transaction)){
                        console.error('une transaction identique apparait plus dune fois dans le block');
                        return false;

                    } else { 
                        transaction.add(transaction);

                    }
                }
            }
        }
        return true; 
    }

    static ChainValidator(chain){
        if(JSON.stringify(chain[0]) !== (Block.genesis())){
            return false;
        };

        for (let i=1; i<chain.length; i++){

            const { timestamp, lastHash, hash, nonce, difficulty, data } = chain[i];
            const actualLastHash = chain[i-1].hash; 
            const lastDifficulty = chain[i-1].difficulty;



            if(lastHash !== actualLastHash) return false; 

            const validateHash = cryptoHasher(timestamp, lastHash, data, nonce, difficulty);
            
            if (hash !== validateHash) return false; 

            if (Math.abs(lastDifficulty - difficulty) > 1) return false;
        }
        

        return true; 
    }
}



module.exports = Blockchain; 