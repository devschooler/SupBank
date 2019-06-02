const Transaction = require('../wallet/transaction');




class TransactionMiner { 


    constructor({ blockchain, transactionPool, wallet, pubsub })
    {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.wallet = wallet;
        this.pubsub = pubsub;
    }

    
    mineTransactions() { 
    // recupere les transactions valides du pool
    const validTransactions = this.transactionPool.validTransactions();
    // genere les récompenses des mineurs 
    validTransactions.push( 
        Transaction.transactionRewarder({ minerWallet: this.wallet })
    );
    
    // ajoute un block de ces transactions à la blockchain
    this.blockchain.addBlock({ data: validTransactions });
    // diffuse la blockchain mise à jour
    this.pubsub.broadcastChain();

    // néttoie la pool 
    this.transactionPool.clear();
    }
}

module.exports = TransactionMiner;