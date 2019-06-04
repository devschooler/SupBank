const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const path = require('path');
const Blockchain = require('./blockchain');
const PubSub = require('./app/pubsub');
const TransactionPool = require('./wallet/transaction-pool');
const Wallet = require('./wallet');
const TransactionMiner = require('./app/reward');

const app = express();
const blockchain = new Blockchain();
const transactionPool = new TransactionPool();
const wallet = new Wallet();
const pubsub = new PubSub({ blockchain, transactionPool });
const transactionMiner = new TransactionMiner({ blockchain, transactionPool, wallet, pubsub });

const DEFAULT_PORT = 3000; 
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;


app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,'client/dist')));

app.get('/api/blocks', (req,res) => {
res.json(blockchain.chain);

});
// mine un block 
app.post('/api/mine', (req,res) => {
    const { data } = req.body;
    blockchain.addBlock( { data });
    pubsub.broadcastChain();
    res.redirect('/api/blocks');
}); 

// envoi d'une transaction 

app.post('/api/transact',(req,res) => { 
    const { amount, recipient } = req.body;
    let transaction = transactionPool.existingTransaction({ inputAddress: wallet.publicKey });

    try {
        // si la transaction existe déjà on update le wallet 
        if (transaction) {
            transaction.update({ senderWallet: wallet, recipient, amount});
        }
 //sinon on le crée
        else {
            transaction = wallet.createTransaction({ recipient, amount, chain: blockchain.chain });

        }
    } catch(error) 
     { 
        return res.status(400).json({ type:'error',message: error.message});
     }



    transactionPool.setTransaction(transaction);

   // console.log('transactionPool', transactionPool);
     pubsub.transactionBroadcaster(transaction);
    res.json({type:'success',transaction});
});

// carte des transactions 
app.get('/api/transaction-map', (req, res) => {
    res.json(transactionPool.transactionMap);
  });


app.get('/api/mine-transactions', (req, res) => { 
  transactionMiner.mineTransactions();
  res.redirect('/api/blocks');
})

app.get('/api/wallet-info',(req, res) => {
  const address = wallet.publicKey;
  
  res.json({ 
    address, 
    balance: Wallet.BalanceCalculator({ chain: blockchain.chain, address: wallet.publicKey})
  })
})
// 
app.get('*', (req,res) => { 
res.sendFile(path.join(__dirname,'./client/dist/index.html'));
});

// synchronisation lors de la connexion a un node 
const RootStateSyncher = () => {
    request({ url: `${ROOT_NODE_ADDRESS}/api/blocks` }, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        const rootChain = JSON.parse(body);
  
        console.log('remplace la chaine lors de la synchro', rootChain);
        blockchain.chainReplacer(rootChain);
      }
    });
  
    request({ url: `${ROOT_NODE_ADDRESS}/api/transaction-pool-map` }, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        const rootTransactionPoolMap = JSON.parse(body);
  
        console.log('remplace la transaction pool map lors de la synchro a un noed', rootTransactionPoolMap);
        transactionPool.setMap(rootTransactionPoolMap);
      }
    });
  };

let PEER_PORT;

if(process.env.GENERATE_PEER_PORT === 'true' ){
    PEER_PORT = DEFAULT_PORT + 1-1000; Math.ceil(Math.random() * 1000);
}

const PORT = PEER_PORT || DEFAULT_PORT;
app.listen(PORT, () => {
    console.log(`ecoute &sur localhost:3000:${PORT}`);

    // syncronisation lorsque ce n'est pas le même port 
    if (PORT !== DEFAULT_PORT){
        RootStateSyncher();
    }
    
});