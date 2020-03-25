const TicketChain = artifacts.require('TicketChain');
// const LoyaltyCoin = artifacts.require("LoyaltyCoin");

module.exports = function(deployer, network, accounts) {
  const platform = accounts[0];
  // let loyaltyInstance;
  let ticketInstance;

  deployer.deploy(TicketChain, { from: platform }).then(() => {
    console.log('TicketChain address: ' + TicketChain.address);
  });
  // .then(() => {
  //   return deployer.deploy(LoyaltyCoin, { from: platform });
  // })
  // .then(_inst => {
  //   loyaltyInstance = _inst;
  //   return deployer.deploy(EventTicket, { from: platform });
  // })
  // .then(_inst => {
  //   ticketInstance = _inst;
  //   return deployer.deploy(
  //     TicketChain,
  //     loyaltyInstance.address,
  //     ticketInstance.address,
  //     { from: platform },
  //   );
  // });
};
