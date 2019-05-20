const express = require('express');
const Blockchain = require('./blockchain');

const app = express();
const blockchain = new Blockchain();

app.get('/api/blocks', (req,res) => {
res.json(blockchain.chain);

});
const PORT = 3000;
app.listen(3000, () => console.log(`ecoute sur localhost:3000:${PORT}`));