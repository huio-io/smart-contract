// See <http://truffleframework.com/docs/advanced/configuration>
// to customize your Truffle configuration!
module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      gas: 5999999,
      network_id: "*" // Match any network id
    }
}};
