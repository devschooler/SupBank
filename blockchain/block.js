const hexToBinary = require('hex-to-binary');
const { FIRSTBLOCK_DATA, MINE_RATE } = require('../config');
const crypto = require('crypto');



const cryptoHasher = (...inputs) => {
    const hash = crypto.createHash('sha256');
  
    hash.update(inputs.map(input => JSON.stringify(input)).sort().join(' '));
  
    return hash.digest('hex');
  }; 

class Block {
  constructor({ timestamp, lastHash, hash, data, nonce, difficulty }) {
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
    this.nonce = nonce;
    this.difficulty = difficulty;
  }

  static genesis() {
    return new this(FIRSTBLOCK_DATA);
  }

  static blockMiner({ lastBlock, data }) {
    const lastHash = lastBlock.hash;
    let hash, timestamp;
    let { difficulty } = lastBlock;
    let nonce = 0;

    do {
        nonce++;
        timestamp = Date.now();
        difficulty = Block.modifyDifficulty({ originalBlock: lastBlock, timestamp });
        hash = cryptoHasher(timestamp, lastHash, data, nonce, difficulty); 
        cryptoHasher();
      } while (hexToBinary(hash).substring(0, difficulty) !== '0'.repeat(difficulty));
  
      return new this({ timestamp, lastHash, data, difficulty, nonce, hash });
    }

  static modifyDifficulty({ originalBlock, timestamp }) {
    const { difficulty } = originalBlock;

    if (difficulty < 1) return 1;

    if ((timestamp - originalBlock.timestamp) > MINE_RATE ) return difficulty - 1;

    return difficulty + 1;
  }
}

module.exports = Block;
