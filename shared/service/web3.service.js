const Web3 = require('web3');
web3 = new Web3(new Web3.providers.HttpProvider(process.env.rinkebyEndpoint));

const Tx = require('ethereumjs-tx');
const helper = require('../helper');
const Unit = helper.Unit;
const ownerAddress = process.env.HuioMainAccount_Address
const ownerPrivateKeyBuffer = new Buffer(process.env.HuioMainAccount_PrivateKey, 'hex')
const eth_to_wei = 1000000000000000000;

const IcoContractAddress = process.env.IcoContractAddress;
const IcoContractInstance = web3.eth.contract(require('../../contracts/build/contracts/IcoContract.json').abi)
    .at(IcoContractAddress);

const getBalanceOfAddress = (address, unit = Unit.ether) => web3.fromWei(web3.eth.getBalance(address), unit).toNumber();

const isAddress = (address) => web3.isAddress(address);

const addTokenToAddress = (userAddress, amount) => new Promise((resolve, reject) => {
    const callData = IcoContractInstance.addTokenToUser.getData(userAddress, amount * eth_to_wei);

    var rawTx = {
        gasPrice: 500,
        gas: 700000, // 700k gas
        to: IcoContractAddress,
        data: callData,
        nonce: web3.eth.getTransactionCount(ownerAddress)
    }
    var tx = new Tx(rawTx);
    tx.sign(ownerPrivateKeyBuffer);
    web3.eth.sendRawTransaction(`0x${tx.serialize().toString('hex')}`, (err, hash) => err ? reject(err) : resolve(hash));
});

const getBalanceToken = (userAddress) => new Promise((resolve, reject) => {
    IcoContractInstance.getTokenBalance.call(userAddress, (err, result) => err ? reject(err) : resolve(result.toNumber() / eth_to_wei));
});

const getBalanceEthereum = (userAddress) => Promise.resolve(0);

const updateUserWalletAddress = (userAddress, walletAddress) => Promise.resolve();

const isWeb3Connected = () => web3.isConnected();

const updateConfigContract = (supply, ownership, addressMigration,
    startTime, endTime) => Promise.resolve();
module.exports = {
    getBalanceOfAddress,
    isAddress,
    addTokenToAddress,
    getBalanceToken,
    getBalanceEthereum,
    updateUserWalletAddress,
    updateConfigContract,
    isWeb3Connected
}