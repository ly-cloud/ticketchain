pragma solidity ^0.5.0;

contract TicketChain {
    // for marketplace

  LoyaltyCoin loyaltyCoin;
  EventTicket eventTicket;
  uint256 commission;
  uint256 rate;
  uint256 redeemRate;
  address _owner;
  
  constructor(LoyaltyCoin loyaltyCoinAddr, EventTicket eventTicketAddr) public {
    loyaltyCoin = loyaltyCoinAddr;
    eventTicket = eventTicketAddr;
    _owner = msg.sender;
  }

  struct TicketInfo {
    uint256 eventId;
    uint256 ticketId;
    uint256 price;
  }

  TicketInfo[] ticketInfos;

  mapping (uint256 => bool) private transactions;

  modifier onlyOwner() {
    require(_owner == msg.sender);
    _;
  }

  modifier onlySeller(uint256 ticketId) {
    require(eventTicket.ownerOf(ticketId) == msg.sender);
    _;
  }

  modifier onlyPrevOwner(uint256 ticketId) {
    require(eventTicket.getPrevOwner(ticketId) == msg.sender);
    _;
  }

  function listTicket(uint256 eventId, uint256 ticketId, uint256 price) puclic onlySeller(ticketId) {
  	require(price <= eventTicket.getOriginalPrice(ticketId));

    TicketInfo memory newTicketInfo = TicketInfo(eventId, ticketId, price);
    ticketInfos[ticketId] = newTicketInfo;
  }

  function changePrice(uint256 ticketId, uint256 newPrice) puclic onlyPrevOwner(ticketId) {
  	require(eventTicket.ownerOf(ticketId) == _owner);
  	require(newPrice <= eventTicket.getOriginalPrice(ticketId));

    ticketInfos[ticketId].price = newPrice;
  }

  function unlistTicket(uint256 ticketId) puclic onlyPrevOwner(ticketId) {
  	require(eventTicket.ownerOf(ticketId) == _owner);

  	eventTicket.transferTo(ticketId, msg.sender);
    ticketInfos[ticketId] = 0;
  }

  function buyTicket(uint256 ticketId, uint256 loyalty) public payable {
    require(ticketInfos[ticketId] != 0); //is listed
    require(block.timestamp >= eventTicket.getOpenSaleTime(ticketId) && block.timestamp < eventTicket.getClosingSaleTime(ticketId));

    if(loyalty = 0){
      require(msg.value >= (ticketInfos[ticketId].price + comission)); //offerred price meets minimum ask

      address payable recipient = address(uint160(eventTicket.ownerOf(ticketId)));
      recipient.transfer(msg.value - comission);    //transfer (price-comission) to real owner

      emit Transaction(nextTransactionId, ticektId);
      nextTransactionId++;

    } else {
      uint256 remaining = ticketInfos[ticketId].price + comission - loyalty/redeemRate;
      require(msg.value >= remaining);

      address payable recipient = address(uint160(eventTicket.ownerOf(ticketId)));
      recipient.transfer(remaining);    //transfer remaining amount 

      //TODO from ticketChain to receipent
      //recipient.transfer(ticketInfos[ticketId].price - remaining {from: _owner});
    }

    eventTicket.transferTo(ticketId, msg.sender);
    loyaltyCoin.issuePoint(msg.sender, rate);
  }

  function getTicketInfo(uint256 ticketId) public view returns(ticketInfo) {
    return ticketInfos[ticketId];
  }

  function getRedeemRate() public view returns(uint256) {
    return redeemRate;
  }

  function setRedeemRate(uint256 conversion) public onlyOwner {
    redeemRate = conversion;
  }

  function getRate() public view returns(uint256) {
    return rate;
  }

  function setRate(uint256 amount) public onlyOwner {
    rate = amount;
  }

  function getCommission() public view returns(uint256) {
    return commission;
  }

  function setCommission(uint256 value) public onlyOwner {
    commission = value;
  }

  function withdraw() public {
    if(msg.sender == _owner)
      msg.sender.transfer(address(this).balance);
  }
  
}
