const Blockchain = require ('./blockchain/blockchain');

const blockchain = new Blockchain();

blockchain.addBlock({ data: 'primary' });

let lastTimestamp, futureTimestamp, futureBlock, diffTime, moyenne; 

const times = [];

for (let i=0; i<10000; i++) { 
    lastTimestamp = blockchain.chain[blockchain.chain.length-1].timestamp;
    blockchain.addBlock({ data: `block ${i}`});
 
    futureBlock = blockchain.chain[blockchain.chain.length-1];
    futureTimestamp = futureBlock.timestamp;
    diffTime = futureTimestamp - lastTimestamp ;

    times.push(diffTime) ;

    moyenne= times.reduce((total,num) => (total + num))/times.length; 
    


    //console.log('temps de minage dun block: ${diffTime}ms. Difficulty: ${futureBlock.Difficulty}. Moyenne time: ${moyenne}ms'); 

    console.log(futureBlock);
}