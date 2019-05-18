const Blockchain = require('./blockchain');

const blockchain = new Blockchain(); 

blockchain.addBlock({data : 'initial'});
console.log('first-block', blockchain.chain[blockchain.chain.length-1]);
let lastTimestamp, futureTimestamp, futureBlock, timeDiff, average;

const times = [];

for (let i=0; i<10000; i++) {
    lastTimestamp = blockchain.chain[blockchain.chain.length-1].timestamp;
    blockchain.addBlock({ data: `block ${i}`});

    futureBlock = blockchain.chain[blockchain.chain.length-1];

    futureTimestamp = futureBlock.timestamp;
    timeDiff = futureTimestamp - lastTimestamp;
    times.push(timeDiff);

    average = times.reduce((total, num) => (total + num))/times.length;
    //console.log( `${difficulty}`);
    console.log(`temps de minage de block: ${timeDiff}ms. Difficulty: ${futureBlock.difficulty}. Average time: ${average}ms`);
 

}