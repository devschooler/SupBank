
const redis = require('redis');
const CHANNELS = { 
    TEST: 'TEST',
    BLOCKCHAIN: 'BLOCKCHAIN',
    TRANSACTION: 'TRANSACTION'
};

class PubSub { 
    constructor({ blockchain, transactionPool }) {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.publisher = redis.createClient();
        this.subscriber = redis.createClient();

        this.subscribeToChannels();
        this.subscriber.on('message',(channel,message) => this.handleMessage(channel, message));
    }

    handleMessage(channel,message){
        console.log(`message reçu, canal : ${channel}. message : ${message}.`);

        const parsedMessage = JSON.parse(message);
       
        switch(channel){
            case CHANNELS.BLOCKCHAIN:
                this.blockchain.chainReplacer(parsedMessage, true, () => { 
                    this.transactionPool.clearBlockchainTransactions({
                        chain: parsedMessage
                    });
                });
            break;  
            case CHANNELS.TRANSACTION:
                this.transactionPool.setTransaction(parsedMessage);
            break;
            default:
                return;
        }

    }
       

    subscribeToChannels(){
        Object.values(CHANNELS).forEach(channel=> {
            this.subscriber.subscribe(channel);
        });
    }
    
publish({ channel,message }) { 
    this.subscriber.unsubscribe(channel, () => { 
        this.publisher.publish(channel,message, () => { 
            this.subscriber.subscribe(channel);
        });
    });

}

broadcastChain(){
    this.publish({ 
        channel: CHANNELS.BLOCKCHAIN,
        message: JSON.stringify(this.blockchain.chain)
    });
}

    transactionBroadcaster(transaction){
        this.publish({
        channel: CHANNELS.TRANSACTION,
        message: JSON.stringify(transaction)
         });
    }
}



//const testPubSub = new PubSub();
//setTimeout(() => testPubSub.publisher.publish(CHANNELS.TEST, 'FOO'), 1000);  

module.exports = PubSub;
