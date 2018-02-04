const Web3 = require('web3');
web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
console.log(web3.eth.accounts)
web3.eth.defaultAccount = web3.eth.accounts[0];
var balance = web3.eth.getBalance(web3.eth.accounts[0]);
console.log('balance:', balance);
var IcoContractABI = require('./../contracts/build/contracts/IcoContract.json').abi;
const IcoContractAddress = '0x1ba1e4a8e4590b60363dae4ab3a66794e7b96db1';

var IcoContractInstance = web3.eth.contract(IcoContractABI).at(IcoContractAddress);

const privateKey = Buffer.from('e331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109', 'hex')


describe('test web3 & ethereumjs-tx', function () {
  it('test1', done => {
   
  })
})