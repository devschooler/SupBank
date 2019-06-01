const MINE_RATE = 1000; 

const FIRST_DIFFICULTY = 3; 


const FIRSTBLOCK_DATA = {
    timestamp: 1, 
    lastHash: '----',
    hash:'first-hash',
    difficulty: FIRST_DIFFICULTY,
    nonce: 0,
    data: []
}; 

const BALANCE_AT_START = 1000;

const REWARD = { address: '*authorized-reward*' };

const MINING_REWARD = 50; 

module.exports = { FIRSTBLOCK_DATA, MINE_RATE, BALANCE_AT_START, MINING_REWARD, REWARD };