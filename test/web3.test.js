const Web3 = require('web3');
import {
    BigNumber
} from 'bignumber.js'
web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
describe('test', function () {
    var balance = web3.eth.getBalance(someAddress);
})