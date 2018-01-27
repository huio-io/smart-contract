const assert = require('assert');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
const ethFundHui = '0x0076900774D91414c906656ad61a02b9d7aA222d';
const eth_to_wei = 1000000000000000000;

const IcoContractAddress = '0x09120db114d0676b43c41d57db33f1929ba3aff4';
const TokenContractAddress = '0x947728db419f6f281da852084064a32d1c1aa086';


const account1 = '0x38f6081af016139e2db8be42ee61417cd03b21a1';
const account2 = '0x6e29d19dce2d59e65ee8b0ccd2724eb3e48ac88e';
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
        const account1 = '0x007F9921DBb5c381Ffe9993DF50137Dc643de36C';
        const account2 = '0x003524F296Dab42c0421f30F67F69Ee46735Ba12';
        console.log(`Balance of account 01 = ${web3.fromWei(web3.eth.getBalance(account1).toString(), 'ether')}`);
        console.log(`Balance of account 02 = ${web3.fromWei(web3.eth.getBalance(account2).toString(), 'ether')}`);
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

    it.skip('verify function create token', function (done) {
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
