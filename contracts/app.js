var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
console.log(web3.version.api);
const addressRPC1 = '0x00e68a9f47eC93F2D75Ef3473bB09e6B5d5654e4';

var IcoContractABI = require('./build/contracts/IcoContract.json').abi;
const IcoContractAddress = '0xc20d37a5dfcf3d0f5120b98d6494d82074e8ce57';

var IcoTokenContractABI = require('./build/contracts/IcoToken.json').abi;
const TokenContractAddress = '0x35d2515c78de334703c499456a68d2f8ce459f2c';


var IcoContractInstance = web3.eth.contract(IcoContractABI).at(IcoContractAddress);
var IcoTokenContractInstance = web3.eth.contract(IcoTokenContractABI).at(TokenContractAddress);


console.log(IcoContractInstance.testGetIcoContract.call());



// var balanceOfAddress1 = web3.eth.getBalance(addressRPC1);

// console.log(web3.fromWei(balanceOfAddress1.toNumber(), 'ether'));



