pragma solidity ^0.5.5;

import './EventTicket.sol';


contract TicketChain {
  address public OWNER;
  uint256 public commission;
  uint256 eventIdCounter;
  mapping(uint256 => EventTicket) public events;

  struct Listing {
    address seller;
    uint256 price;
    bool listed;
    uint256 seatNumber;
  }

  mapping(uint256 => mapping(uint256 => Listing)) public ticketsListing;

  constructor() public {
    OWNER = msg.sender;
  }

  modifier onlyOwner() {
    require(msg.sender == OWNER, 'Only callable by contract owner');
    _;
  }

  modifier validEvent(uint256 eventId) {
    require(eventId <= eventIdCounter, 'Invalid Event ID');
    _;
  }

  modifier onlyTicketOwner(uint256 eventId, uint256 ticketId) {
    EventTicket eventTicket = events[eventId];
    require(
      msg.sender == eventTicket.getPrevOwner(ticketId),
      'Only callable by original ticket owner'
    );
    require(
      address(this) == eventTicket.getCurrOwner(ticketId),
      'Ticket not transferred TicketChain'
    );
    _;
  }

  function withdraw() public onlyOwner {
    msg.sender.transfer(address(this).balance);
  }

  function setCommission(uint256 _commission) public onlyOwner {
    commission = _commission;
  }

  function newEvent() public returns (uint256 eventId) {
    EventTicket etContract = EventTicket(msg.sender);
    require(
      etContract.isEventTicket(),
      'Only callable by EventTicket contract'
    );
    eventIdCounter++;
    events[eventIdCounter] = etContract;
    return eventIdCounter;
  }

  function list(
    uint256 eventId,
    uint256 ticketId,
    uint256 price,
    uint256 seatNumber
  ) public validEvent(eventId) onlyTicketOwner(eventId, ticketId) {
    require(
      !ticketsListing[eventId][ticketId].listed,
      'Ticket is already listed'
    );
    EventTicket eventTicket = events[eventId];
    require(
      price <= eventTicket.getOriginalPrice(ticketId),
      'Cannot list above original price'
    );

    Listing memory newListing = Listing(msg.sender, price + commission, true, seatNumber);
    ticketsListing[eventId][ticketId] = newListing;
  }

  function updatePrice(uint256 eventId, uint256 ticketId, uint256 newPrice)
    public
    validEvent(eventId)
    onlyTicketOwner(eventId, ticketId)
  {
    require(ticketsListing[eventId][ticketId].listed, 'Ticket is not listed');
    EventTicket eventTicket = events[eventId];
    require(
      newPrice <= eventTicket.getOriginalPrice(ticketId),
      'Cannot list above original price'
    );

    ticketsListing[eventId][ticketId].price = newPrice + commission;
  }

  function unlist(uint256 eventId, uint256 ticketId)
    public
    validEvent(eventId)
    onlyTicketOwner(eventId, ticketId)
  {
    EventTicket eventTicket = events[eventId];
    delete ticketsListing[eventId][ticketId];
    eventTicket.transferTo(ticketId, msg.sender);
  }

  function buy(uint256 eventId, uint256 ticketId)
    public
    payable
    validEvent(eventId)
  {
    require(ticketsListing[eventId][ticketId].listed, 'Ticket is not listed');
    EventTicket eventTicket = events[eventId];
    require(
      msg.value >= ticketsListing[eventId][ticketId].price,
      'Payment insufficient'
    );
    require(
      now >= eventTicket.openSaleTime() && now < eventTicket.closingSaleTime(),
      'Ticket not on sale'
    );

    address payable recipient = address(
      uint160(eventTicket.getPrevOwner(ticketId))
    );

    delete ticketsListing[eventId][ticketId];
    eventTicket.transferTo(ticketId, msg.sender);
    recipient.transfer(msg.value - commission);
  }

  function getTotalEvents() public view returns (uint256) {
    return eventIdCounter;
  }

  function getCommission() public view returns (uint256) {
    return commission;
  }

  function eventExists(uint256 eventId) public view returns (bool) {
    return eventId <= eventIdCounter;
  }

  function getPrice(uint256 eventId, uint256 ticketId)
    public
    view
    returns (uint256)
  {
    return ticketsListing[eventId][ticketId].price;
  }

  function getBalance() public view onlyOwner returns(uint256) {
    return address(this).balance;
  }

  function() external payable {}
}
