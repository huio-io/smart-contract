const Web3Service = require('./web3.service');

function addToken(amount, userId) {
    return Web3Service.addTokenToAddress(userId, amount);
}

function getBalance(userId) {
    return Promise.all([Web3Service.getBalanceToken(userId),
        Web3Service.getBalanceEthereum(userId)
    ]);
}

function updateUserWalletAddress(userId, walletAddress) {
    return Web3Service.updateUserWalletAddress(userId, walletAddress);
}
module.exports = {
    addToken,
    getBalance,
    updateUserWalletAddress
}