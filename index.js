const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const Blockchain = require('./blockchain');
const PubSub = require('./app/pubsub');
const TransactionPool = require('./wallet/transaction-pool');
const Wallet = require('./wallet');

const app = express();
const blockchain = new Blockchain();
const transactionPool = new TransactionPool();
const wallet = new Wallet();
const pubsub = new PubSub({ blockchain });

const DEFAULT_PORT = 3000; 
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;


app.use(bodyParser.json());

app.get('/api/blocks', (req,res) => {
res.json(blockchain.chain);

});
app.post('/api/mine', (req,res) => {
    const { data } = req.body;
    blockchain.addBlock( { data });
    pubsub.broadcastChain();
    res.redirect('/api/blocks');
}) 


// synchronisation lors de la connexion a un node 
const chainSync = () => { 
    request({ url: `${ROOT_NODE_ADDRESS}/api/blocks`}, (error,response,body) => {
        if (!error && response.statusCode === 200) {
            const rootChain = JSON.parse(body);
            console.log('remplace la chaine lors dune synchronisation avec', rootChain); 
            blockchain.chainReplacer(rootChain);
        }
    })
}

let PEER_PORT;

if(process.env.GENERATE_PEER_PORT === 'true' ){
    PEER_PORT = DEFAULT_PORT + 1-1000; Math.ceil(Math.random() * 1000);
}

const PORT = PEER_PORT || DEFAULT_PORT;
app.listen(PORT, () => {
    console.log(`ecoute &sur localhost:3000:${PORT}`);

    // syncronisation lorsque ce n'est pas le même port 
    if (PORT !== DEFAULT_PORT){
        chainSync();
    }
    
});