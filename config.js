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



module.exports = { FIRSTBLOCK_DATA, MINE_RATE };