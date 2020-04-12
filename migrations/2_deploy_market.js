const TicketChain = artifacts.require('TicketChain');

module.exports = function(deployer, network, accounts) {
  const platform = accounts[0];

  deployer.deploy(TicketChain, { from: platform }).then(() => {
    console.log(`TicketChain address: ${TicketChain.address}`);
  });
};
