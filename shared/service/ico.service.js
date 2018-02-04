const Web3Service = require('./web3.service');

function addToken(userAddress, amount) {
    return Web3Service.addTokenToAddress(userAddress, amount);
}

function getBalance(userAddress) {
    return Promise.all([Web3Service.getBalanceToken(userAddress),
        Web3Service.getBalanceWei(userAddress)
    ]);
}

function updateUserWalletAddress(userAddress, walletAddress) {
    return Web3Service.updateUserWalletAddress(userAddress, walletAddress);
}

function updateConfigContract(supply, ownership, addressMigration,
    startTime, endTime) {
    return Web3Service.updateUserWalletAddress(supply, ownership, addressMigration,
        startTime, endTime);
}
module.exports = {
    addToken,
    getBalance,
    updateUserWalletAddress
}