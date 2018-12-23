const SHA256 = require('crypto-js/sha256');

class Block {
    

    //index       : the location of the block in the chain
    //timestamp   : when this block created
    //data        : any data
    //previousHash: a calculated hash using crypto-js library
    constructor(index,timestamp, data, previousHash='') {

        //hash: concat value of index,timestamp, data and previoushash 
        this.hash = this.calculateHash();

        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
    }

    //create a hash by using crypto-js package
    //it concatenates index,timestamp,previoushash and data and pass to 
    //the constructor
    calculateHash = () => {
        return new SHA256(this.index 
            + this.timestamp 
            + this.previousHash 
            + JSON.stringify(this.data)).toString();
    }

    toString() {
        return `index        : ${this.index}
                timestamp    : ${this.timestamp}
                data         : ${this.data}
                previousHash : ${this.previousHash}
               `
    }
}


class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
    }

    //starting block of the blockchain
    createGenesisBlock = () {
        new Block(0,'01/01/2019','-GenesisBlock-','000');
    }

    getLatestBlock =() => {
        return this.chain[this.chain.length -1];
    }

    addBlock = (newBlock) => {
        newBlock.previousHash  = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }

    isChainValid =() => {
        for(let i = 1; this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBLock = this.chain[i-1];
            
            if(currentBlock.hash !== currentBlock.calculateHash()) return false;
            if(currentBlock.previousHash !== previousBLock.hash) return false;

        }

        return true;
    }
}