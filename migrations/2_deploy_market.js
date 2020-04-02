const TicketChain = artifacts.require('TicketChain');
const EventTicket = artifacts.require('EventTicket');
// const LoyaltyCoin = artifacts.require("LoyaltyCoin");

module.exports = function(deployer, network, accounts) {
  const platform = accounts[0];

  deployer.deploy(TicketChain, { from: platform }).then(() => {
    console.log('TicketChain address: ' + TicketChain.address);
    return deployer
      .deploy(
        EventTicket,
        TicketChain.address,
        'Test Event',
        1585926529,
        'Test Venue',
        1585826529,
        1586026529,
        {
          from: platform,
        },
      )
      .then(() => {
        console.log('EventTicket address: ' + EventTicket.address);
      });
  });
};
