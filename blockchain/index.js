const Block = require('./block'); 
const {cryptoHasher} = require('../util');

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