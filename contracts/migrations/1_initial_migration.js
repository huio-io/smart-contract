var Migrations = artifacts.require("./Migrations.sol");
const IcoToken = artifacts.require('IcoToken');
const IcoContract = artifacts.require('IcoContract');

module.exports = function (deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(
    IcoToken,
    'TRON Token',
    'TRX',
    '18',
    '1.0'
  ).then(() => {
    // define params
    
    const ethFundAddress = '0xaaea9575e6d2b21bf93ba259509e1b80a30f2481';// ETH account (9)
    const softCapToken = '100000000000000000000000000'; // 1 billion Tokens
    const ratio_ETH_HUI = '1000'; // 1 ETH = 1000 Token = 1000*10^18 wei
    const dateStart = '1516785704'; // Sat Jan 20 2018 11:16:30
    const dateEnd = '1519377704'; // Sun Jan 21 2018 11:16:30
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

        return instance.setIcoContract(IcoContract.address);

        // return setTimeout(function (IcoContractAddress, TokenContractAddress) {
        //   // Init web3
        //   var Web3 = require('web3');
        //   var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
        //   console.log(web3.version.api);

        //   var IcoContractABI = require('../build/contracts/IcoContract.json').abi;
        //   var IcoTokenContractABI = require('../build/contracts/IcoToken.json').abi;


        //   var IcoContractInstance = web3.eth.contract(IcoContractABI).at(IcoContractAddress);
        //   var IcoTokenContractInstance = web3.eth.contract(IcoTokenContractABI).at(TokenContractAddress);
        //   // init and listenning all events
        //   var events = IcoContractInstance.allEvents({ fromBlock: 0, toBlock: 'latest' }, function (error, result) {
        //     console.log('IcoContractInstance Event triggered');
        //     if (!error) {
        //       if (result.event) {
        //         console.log(result);
        //       }else{
        //         console.log('another event');
        //       }
        //     }
        //     else {
        //       console.log(error);
        //     }
        //   });
        //   // end init web3
        //   // parity --chain dev --ws-origins "*"

        //   const userId = 1;
        //   return testGetToken(IcoContractInstance, IcoTokenContractInstance, userId);
        // }, 4000)
      });
    });
  });
};


function testGetToken(IcoContractInstance, IcoTokenContractInstance, userId) {
  const balance = IcoContractInstance.getTokenBalance.call(userId);
  console.log(`return balannce from userId ${userId} = ${balance}`);
  return;
}

// function testFunc(IcoContractInstance, IcoTokenContractInstance) {
//   // send 2 ETH from ETHFUDHUI

//   const ethFundHui = '0x008D97AA9715F8689057Ae14CCCf4CEA36cAA89f';
//   console.log('before buying token, balance of smart contract = ');
//   console.log(IcoContractInstance.getCurrentBalance.call());
//   console.log('Here is balance below of fund smart contract');
//   console.log(IcoTokenContractInstance.getCurrentBalance.call());

//   return web3.eth.sendTransaction({
//     from: ethFundHui,// from ETH FUND HUI
//     to: IcoContractAddress,
//     value: web3.toWei('3', 'ether') //  ETH
//   }, function (err, result) {
//     if (err) {
//       console.log('ERROR');
//       console.log(err);
//     } else {
//       console.log('OKEEEEE sent succeeded');
//       console.log(result);
//       console.log('Here is balance below of smart contract');
//       console.log(IcoContractInstance.getCurrentBalance.call());
//       console.log('Here is balance below of fund smart contract');
//       console.log(IcoTokenContractInstance.getCurrentBalance.call());
//     }
//   });
// }

