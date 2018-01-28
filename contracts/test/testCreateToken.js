const assert = require('assert');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
const ethFundHui = '0xaaea9575e6d2b21bf93ba259509e1b80a30f2481';
const eth_to_wei = 1000000000000000000;

const IcoContractAddress = '0x99a8d72191053593d1d20952b046b601319c91a9';
const TokenContractAddress = '0x6a21571bf4d5e3f9c2fc128322bd275b50b454da';


const account1 = '0xa4b4326fd40a66e280340aa4284aded705221e50';
const account2 = '0xbcd9c488cf5a1ba4e3c7cca8d649f86304f8022b';

var Tx = require('ethereumjs-tx');
describe('Running mocha suit test', function () {
    const IcoContractInstance = web3.eth.contract(require('../build/contracts/IcoContract.json').abi).at(IcoContractAddress);
    const IcoTokenContractInstance = web3.eth.contract(require('../build/contracts/IcoToken.json').abi).at(TokenContractAddress);

    this.timeout(10000);

    const callBack = function (done) {
        return function (err, result) {
            if (err) {
                console.log('ERROR deteced');
                console.log(err);
            } else {
                console.log('OKKKKKK');
                console.log(result);
            }
            done();
        };

    }
    it.skip('Get ETH balance of account 1 + 2', function (done) {
        const balanceAcc1 = web3.fromWei(web3.eth.getBalance(account1).toNumber(), 'ether');
        const balanceAcc2 = web3.fromWei(web3.eth.getBalance(account2).toNumber(), 'ether');

        console.log(`Balance of account 01 = ${balanceAcc1}`);
        console.log(`Balance of account 02 = ${balanceAcc2}`);
        assert.equal(100, balanceAcc1);
        assert.equal(100, balanceAcc2);
        done();
    });

    it.skip('Get balance token acc 1 + acc 2', function (done) {
        const balance1 = IcoTokenContractInstance.balanceOf.call(account1).toNumber() / eth_to_wei;
        const balance2 = IcoTokenContractInstance.balanceOf.call(account2).toNumber() / eth_to_wei;

        console.log(`Balance 01 = ${balance1}`);
        console.log(`Balance 02 = ${balance2}`);
        done();
    });

    it.skip('Send ETH from account 01 to account 02', function (done) {
        const transactionObject = {
            from: account1,
            to: account2,
            value: web3.toWei('1', 'ether')
        };
        web3.eth.sendTransaction(transactionObject, callBack(done));

    });

    it.skip('send 02 ETH to account 1', function (done) {
        const transactionObject = {
            from: account1,
            to: IcoContractAddress,
            value: web3.toWei('2', 'ether'),
            gasPrice: 50,
            gas: 500000 // 500k gas
        };
        web3.eth.sendTransaction(transactionObject, callBack(function () {
            assert.equal(IcoTokenContractInstance.balanceOf.call(account1).toNumber() / eth_to_wei, 2000);
            done();
        }));

        const events = IcoContractInstance.allEvents({
            fromBlock: 0,
            toBlock: 'latest'
        }, function (error, result) {
            console.log('IcoContractInstance Event triggered');
            if (!error) {
                if (result.event) {
                    console.log(result);
                } else {
                    console.log('another event');
                }
            } else {
                console.log(error);
            }
        });
    });

    it.skip('Add new token to specific account (acc 2)', function (done) {

        var account2 = '0xc09ef4be008e598fec0a578675c56ccfdbf28b28'
        const myCallData = IcoContractInstance.CreateICO.getData(account2, 1234 * eth_to_wei, 5);


        const transactionObject = {
            from: account2,
            to: IcoContractAddress,
            data: myCallData,
            gasPrice: 500,
            gas: 700000 // 700k gas
        };

        console.log(transactionObject);

        web3.eth.sendTransaction(transactionObject, callBack(function () {
            console.log('AFTER balance of acc 2 = ');
            console.log(IcoTokenContractInstance.balanceOf.call(account2).toNumber());
            done();
        }));

        // const events = IcoContractInstance.allEvents({ fromBlock: 0, toBlock: 'latest' }, function (error, result) {
        //     console.log('IcoContractInstance Event triggered');
        //     if (!error) {
        //         if (result.event) {
        //             console.log(result);
        //         } else {
        //             console.log('another event');
        //         }
        //     }
        //     else {
        //         console.log(error);
        //     }
        // });
    });

    it.skip('Use sendRawTransaction to add token', done => {
        var account2 = '0x3515a62a60af4d0212defd6155177316f5ede64b'
        var privateKey = new Buffer('44aae16435b4027f4a49196d2ed120512794dc12f44a411634043cfbb7e85135', 'hex')
        const myCallData = IcoContractInstance.CreateICO.getData(account2, 1234 * eth_to_wei, 5);

        var rawTx = {
            gasPrice: 500,
            gas: 700000, // 700k gas
            to: IcoContractAddress,
            data: myCallData,
            nonce: web3.eth.getTransactionCount(account2)
        }

        var tx = new Tx(rawTx);
        tx.sign(privateKey);

        var serializedTx = tx.serialize();

        console.log('here',serializedTx.toString('hex'));
        // f889808609184e72a00082271094000000000000000000000000000000000000000080a47f74657374320000000000000000000000000000000000000000000000000000006000571ca08a8bbf888cfa37bbf0bb965423625641fc956967b81d12e23709cead01446075a01ce999b56a8a88504be365442ea61239198e23d1fce7d00fcfc5cd3b44b7215f

        web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), function (err, hash) {
            console.log(err);
            if (!err)
                console.log(hash); // "0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385"

            console.log(IcoTokenContractInstance.balanceOf.call(account2).toNumber());
            done();
        });
    });

    it('Use sendRawTransaction to add token', done => {
        var account2 = '0x3515a62a60af4d0212defd6155177316f5ede64b'
        var userId = 10;
        var privateKey = new Buffer('44aae16435b4027f4a49196d2ed120512794dc12f44a411634043cfbb7e85135', 'hex')
        const myCallData = IcoContractInstance.addTokenToUser.getData(userId, 1234 * eth_to_wei);

        var rawTx = {
            gasPrice: 500,
            gas: 700000, // 700k gas
            to: IcoContractAddress,
            data: myCallData,
            nonce: web3.eth.getTransactionCount(account2)
        }

        var tx = new Tx(rawTx);
        tx.sign(privateKey);

        var serializedTx = tx.serialize();

        console.log('here',serializedTx.toString('hex'));
        // f889808609184e72a00082271094000000000000000000000000000000000000000080a47f74657374320000000000000000000000000000000000000000000000000000006000571ca08a8bbf888cfa37bbf0bb965423625641fc956967b81d12e23709cead01446075a01ce999b56a8a88504be365442ea61239198e23d1fce7d00fcfc5cd3b44b7215f

        web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), function (err, hash) {
            console.log(err);
            if (!err)
                console.log(hash); // "0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385"

            console.log(IcoContractInstance.getTokenBalance.call(userId).toNumber());
            done();
        });
    });
    it('GetToken of user', done => {
        var userId = 10;
        IcoContractInstance.getTokenBalance.call(userId, function(err, result){
            console.log(err, result);
            done();
        });
    });
});