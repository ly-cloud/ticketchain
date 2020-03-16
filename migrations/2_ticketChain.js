const EventTicket = artifacts.require("EventTicket");
const LoyaltyCoin = artifacts.require("LoyaltyCoin");
const TicketChain = artifacts.require("TicketChain");

module.exports = function(deployer, network, accounts) {
  const platform = accounts[0];
  let loyaltyInstance;
  let ticketInstance;

  return deployer
    .then(() => {
        return deployer.deploy(LoyaltyCoin, {from: platform});
    }).then((_inst) => {
        loyaltyInstance = _inst;
        return deployer.deploy(EventTicket, {from: platform});
    }).then((_inst) => {
        ticketInstance = _inst;
        return deployer.deploy(TicketChain,
                              loyaltyInstance.address,
                              ticketInstance.address,
                              {from: platform});
    });
};
