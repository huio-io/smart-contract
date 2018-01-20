const Web3Service = require('./web3.service');

function addToken(amount, userId) {
    return Web3Service.addTokenToAddress(userId, amount);
}

function getBalance(userId) {
    return Promise.all([Web3Service.getBalanceToken(userId),
        Web3Service.getBalanceEthereum(userId)
    ]);
}

module.exports = {
    addToken,
    getBalance
}