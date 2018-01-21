var Migrations = artifacts.require("./Migrations.sol");
const IcoToken = artifacts.require('IcoToken');
const IcoContract = artifacts.require('IcoContract');

module.exports = function (deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(
    IcoToken,
    'HuiO Token',
    'Hui',
    '18',
    '1.0'
  ).then(() => {
    // define params
    const ethFundAddress = '0x0076900774D91414c906656ad61a02b9d7aA222d';// ETH account (9)
    const softCapToken = '1000000000'; // 1 billion Tokens
    const ratio_ETH_HUI = '1000'; // 1 ETH = 1000 Token = 1000*10^18 wei
    const dateStart = '1516421790'; // Sat Jan 20 2018 11:16:30
    const dateEnd = '1516508190'; // Sun Jan 21 2018 11:16:30
    const minContributionInWei = '100000000000000000'; // 0.1 ETH, in wei

    // start deployment
    return deployer.deploy(
      IcoContract,
      ethFundAddress, // ETH account (9)
      IcoToken.address,
      softCapToken, // 1 billion Tokens
      ratio_ETH_HUI, // 1 ETH = 1000 Token
      dateStart,
      dateEnd,
      minContributionInWei // 0.1 ETH
    ).then(() => {
      return IcoToken.deployed().then(function (instance) {

        instance.setIcoContract(IcoContract.address);

        return setTimeout(function () {
          // Init web3
          var Web3 = require('web3');
          var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
          console.log(web3.version.api);

          var IcoContractABI = require('../build/contracts/IcoContract.json').abi;
          var IcoTokenContractABI = require('../build/contracts/IcoToken.json').abi;


          var IcoContractInstance = web3.eth.contract(IcoContractABI).at(IcoContractAddress);
          var IcoTokenContractInstance = web3.eth.contract(IcoTokenContractABI).at(TokenContractAddress);

          // end init web3
          
          return testGetToken(IcoContractInstance, IcoTokenContractInstance, userId);
        }, 5000)
      });
    });
  });
};


function testGetToken(IcoContractInstance, IcoTokenContractInstance, userId) {

}

function testFunc(IcoContractInstance, IcoTokenContractInstance) {
  // listenning to event
  var events = IcoContractInstance.allEvents({ fromBlock: 0, toBlock: 'latest' }, function (error, result) {
    console.log('listenning to smart contract');
    if (!error) { console.log(result); }
    else {
      console.log(error);
    }
  });


  // send 2 ETH from ETHFUDHUI

  const ethFundHui = '0x008D97AA9715F8689057Ae14CCCf4CEA36cAA89f';
  console.log('before buying token, balance of smart contract = ');
  console.log(IcoContractInstance.getCurrentBalance.call());
  console.log('Here is balance below of fund smart contract');
  console.log(IcoTokenContractInstance.getCurrentBalance.call());

  return web3.eth.sendTransaction({
    from: ethFundHui,// from ETH FUND HUI
    to: IcoContractAddress,
    value: web3.toWei('3', 'ether') //  ETH
  }, function (err, result) {
    if (err) {
      console.log('ERROR');
      console.log(err);
    } else {
      console.log('OKEEEEE sent succeeded');
      console.log(result);
      console.log('Here is balance below of smart contract');
      console.log(IcoContractInstance.getCurrentBalance.call());
      console.log('Here is balance below of fund smart contract');
      console.log(IcoTokenContractInstance.getCurrentBalance.call());
    }
  });
}

