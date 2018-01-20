const Web3 = require('web3');
web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

const helper = require('../helper');
const Unit = helper.Unit;

// var HuioICOContract = new web3.eth.contract(huioABI, process.env.HuioICOContractAddress, {
//     from: testWallet,
// });

getBalanceOfAddress = (address, unit = Unit.ether) => web3.fromWei(web3.eth.getBalance(address), unit).toNumber();

isAddress = (address) => web3.isAddress(address);

addTokenToAddress = (userId, amount) => nPromise.resolve();

getBalanceToken = (userId) => Promise.resolve(0);

getBalanceEthereum = (userId) => Promise.resolve(0);

updateUserWalletAddress = (userId, walletAddress) => Promise.resolve();

module.exports = {
    getBalanceOfAddress,
    isAddress,
    addTokenToAddress,
    getBalanceToken,
    getBalanceEthereum,
    updateUserWalletAddress
}