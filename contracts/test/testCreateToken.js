const assert = require('assert');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
const ethFundHui = '0xaaea9575e6d2b21bf93ba259509e1b80a30f2481';
const eth_to_wei = 1000000000000000000;

const IcoContractAddress = '0xadab40ab66de3b85fdf8b9d6794851bfe9eef9e7';
const TokenContractAddress = '0x762761f1953787d647958327d10e61b277853722';


const account1 = '0xa4b4326fd40a66e280340aa4284aded705221e50';
const account2 = '0xbcd9c488cf5a1ba4e3c7cca8d649f86304f8022b';
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

    it('Get balance token acc 1 + acc 2', function (done) {
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
            gas: 500000// 500k gas
        };
        web3.eth.sendTransaction(transactionObject, callBack(function () {
            assert.equal(IcoTokenContractInstance.balanceOf.call(account1).toNumber() / eth_to_wei, 2000);
            done();
        }));

        const events = IcoContractInstance.allEvents({ fromBlock: 0, toBlock: 'latest' }, function (error, result) {
            console.log('IcoContractInstance Event triggered');
            if (!error) {
                if (result.event) {
                    console.log(result);
                } else {
                    console.log('another event');
                }
            }
            else {
                console.log(error);
            }
        });
    });

    it('Add new token to specific account (acc 2)', function (done) {

        const myCallData = IcoContractInstance.CreateICO.getData(account2, 1234 * eth_to_wei, 5);

        
        const transactionObject = {
            from: account2,
            to: IcoContractAddress,
            data: myCallData,
            gasPrice: 500,
            gas: 700000// 700k gas
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
});
