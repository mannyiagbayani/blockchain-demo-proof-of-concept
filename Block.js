const SHA256 = require("crypto-js/sha256");

class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }
}
class Block {
  //timestamp   : when this block created
  //data        : any data
  //previousHash: a calculated hash using crypto-js library
  //nonce       : increment the number  of a transaction processing
  constructor(timestamp, transactions,data, previousHash = "") {
    //hash: concat value of index,timestamp, data and previoushash
    this.hash = this.calculateHash();
    this.nonce = 0;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.transactions = transactions;
  }

  //create a hash by using crypto-js package
  //it concatenates index,timestamp,previoushash and data and pass to
  //the constructor
  calculateHash() {
    return new SHA256(
        this.index +
        this.timestamp +
        this.previousHash +
        JSON.stringify(this.data) +
        this.nonce
    ).toString();
  }

  //proof of work that increment the nonce.
  //it check the number of leading zero of the hash
  //it should be equal to number of zero of the difficulty
  mineBlock(difficulty) {
    while(this.hash.substring(0,difficulty) !== Array(difficulty + 1).join("0")){
        this.nonce++;
        this.hash = this.calculateHash();
    }

    console.log(`block mined: ${this.hash} 
                 nonce      : ${this.nonce}`);
  }

  toString() {
    return `index        : ${this.index}
                timestamp    : ${this.timestamp}
                data         : ${this.data}
                previousHash : ${this.previousHash}
                nonce        : ${this.nonce}
               `;
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2;
    this.pendingTransaction = [];
    this.miningReward = 1000;
  }

  //starting block of the blockchain
  createGenesisBlock() {
    return new Block("01/01/2019", "-GenesisBlock-", "000");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
  }

  minePendingTransation(miningRewardAddress) {
    let block = new Block(Date.now(),this.pendingTransaction);
    block.mineBlock(this.difficulty);
    this.pendingTransaction = [new Transaction(null,miningRewardAddress,this.miningReward)];
    console.log('block mined successfully');
    this.chain.push(block);
  }

  createTransaction(transaction) {
    this.pendingTransaction.push(transaction);
  }

  getBalanceAddress(address) {
    let balance = 0;
    for (const block of this.chain) {
      for (const trans of block.transactions) {
        if(trans.fromAddress === address){
          balance -= trans.amount;
        }

        if(trans.toAddress === address) {
          balance += trans.amount;
        }
      }
    }

    return balance;
  }

  //Checking if all blocks in the chain are valid
  isChainValid() {
    console.log(this.chain.length);
    for (let i = 1; i <= this.chain.length - 1; i++) {
      const currentBlock = this.chain[i];
      const previousBLock = this.chain[i - 1];
      if (currentBlock.hash !== currentBlock.calculateHash()) return false;
      if (currentBlock.previousHash !== previousBLock.hash) return false;
      
    }

    return true;
  }
}


//Quick test
let ourCrypto = new Blockchain();
// ourCrypto.addBlock(new Block(1,'01/01/2015',{amount: 100}));
// ourCrypto.addBlock(new Block(2,'01/01/2016',{amount: 200}));
// ourCrypto.addBlock(new Block(3,'01/01/2017',{amount: 300}));
// ourCrypto.addBlock(new Block(4,'01/01/2018',{amount: 400}));
// ourCrypto.addBlock(new Block(5,'01/01/2019',{amount: 500}));

//checking for valid chain
//console.log(JSON.stringify(ourCrypto,null,4));
//console.log(`is valid ${ourCrypto.isChainValid()}`)

//checking for not valid chain
//ourCrypto.chain[2].data = {amount: 100};
//ourCrypto.chain[2].hash = ourCrypto.chain[2].calculateHash();
//console.log(`is valid ${ourCrypto.isChainValid()}`)


