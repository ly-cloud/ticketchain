pragma solidity ^0.5.0;

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
    require(msg.sender == OWNER, "Sender not authorized, only owner can call");
    _;
  }

  modifier validEvent(uint256 eventId) {
    require(eventId <= eventIdCounter, "Invalid Event as eventId has to be <= eventIdCounter");
    _;
  }

  modifier onlyTicketOwner(uint256 eventId, uint256 ticketId) {
    EventTicket eventTicket = events[eventId];
    require(msg.sender == eventTicket.getPrevOwner(ticketId), "Sender is not the previous owner");
    require(address(this) == eventTicket.getCurrOwner(ticketId), "TicketChain contract is not the current owner");
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
    require(etContract.isEventTicket());
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
    require(!ticketsListing[eventId][ticketId].listed);
    EventTicket eventTicket = events[eventId];
    require(price <= eventTicket.getOriginalPrice(ticketId));

    Listing memory newListing = Listing(msg.sender, price, true, seatNumber);
    ticketsListing[eventId][ticketId] = newListing;
  }

  function updatePrice(uint256 eventId, uint256 ticketId, uint256 newPrice)
    public
    validEvent(eventId)
    onlyTicketOwner(eventId, ticketId)
  {
    require(ticketsListing[eventId][ticketId].listed);
    EventTicket eventTicket = events[eventId];
    require(newPrice <= eventTicket.getOriginalPrice(ticketId));

    ticketsListing[eventId][ticketId].price = newPrice;
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
    require(ticketsListing[eventId][ticketId].listed);
    EventTicket eventTicket = events[eventId];
    require(msg.value >= ticketsListing[eventId][ticketId].price);
    require(
      now >= eventTicket.openSaleTime() && now < eventTicket.closingSaleTime()
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

  function getCommission() public view returns(uint256) {
    return commission;
  }

  function getPrice(uint256 eventId, uint256 ticketId) public view returns(uint256) {
    return ticketsListing[eventId][ticketId].price;
  }
}
