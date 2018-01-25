const assert = require('assert');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
const ethFundHui = '0x92764a15d2367b997378704d3565d43566513003';
const eth_to_wei = 1000000000000000000;

const IcoContractAddress = '0xc5ad02eac0497392355ad562cccf58de8c6ea7d6';
const TokenContractAddress = '0x0166c37682fdd435fcd8529bc6d16aa27c89ab62';


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
    it('Get balance of account 1 + 2', function (done) {
        const account1 = '0x8668cb45e294c0a254f38e7b44048334580f588e';
        const account2 = '0x8b774affbb38d87767fca579a289a01787572493';
        console.log(`Balance of account 01 = ${web3.fromWei(web3.eth.getBalance(account1).toString(), 'ether')}`);
        console.log(`Balance of account 02 = ${web3.fromWei(web3.eth.getBalance(account2).toString(), 'ether')}`);
        done();
    });

    it.skip('Send ETH from account 01 to account 02', function (done) {
        const account1 = '0x38f6081af016139e2db8be42ee61417cd03b21a1';
        const account2 = '0x6e29d19dce2d59e65ee8b0ccd2724eb3e48ac88e';
        const transactionObject = {
            from: account1,
            to: account2,
            value: web3.toWei('1', 'ether')
        };
        web3.eth.sendTransaction(transactionObject, callBack(done));

    });

    it('verify function create token', function (done) {
        const account1 = '0x8668cb45e294c0a254f38e7b44048334580f588e';
        const transactionObject = {
            from: account1,
            to: IcoContractAddress,
            value: web3.toWei('2', 'ether'),
            gasPrice: 50,
            gas: 500000// 500k gas
        };
        web3.eth.sendTransaction(transactionObject, callBack(function () {
            assert.equal(IcoTokenContractInstance.balanceOf.call(account1).toNumber() / eth_to_wei, 3000);
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
});
