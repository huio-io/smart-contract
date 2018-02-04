describe('Starting Mocha test', function () {
    const IcoContractAddress = '0x3528f2b61d8ee812caf634e83e2011e88de251b8';
    const TokenContractAddress = '0xef01c3e9a06022cc80b8a44786a47106cf9ec164';
    var Web3 = require('web3');
    var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

    var IcoContractABI = require('./build/contracts/IcoContract.json').abi;
    var IcoTokenContractABI = require('./build/contracts/IcoToken.json').abi;


    var IcoContractInstance = web3.eth.contract(IcoContractABI).at(IcoContractAddress);
    var IcoTokenContractInstance = web3.eth.contract(IcoTokenContractABI).at(TokenContractAddress);
    const ethFundHui = '0x008D97AA9715F8689057Ae14CCCf4CEA36cAA89f';

    it.skip('Check balance ETH', function () {
        console.log(IcoContractInstance.getCurrentBalance.call());
    });

    it('Check balance token of specific acc', function(){
        console.log(IcoTokenContractInstance.balanceOf.call('0x008D97AA9715F8689057Ae14CCCf4CEA36cAA89f'));
    });
});