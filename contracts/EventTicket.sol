pragma solidity ^0.5.0;

import './TicketChain.sol';


contract EventTicket {
  address OWNER;
  TicketChain ticketChain;
  uint256 public eventId;
  string public eventName;
  uint256 public eventDateTime;
  string public venue;
  uint256 public openSaleTime;
  uint256 public closingSaleTime;
  bool public isListed = false;
  bool eventIdSet = false;

  struct Ticket {
    uint256 ticketId;
    uint256 originalPrice;
    uint256 seatNumber;
    address currOwner;
    address prevOwner;
  }

  mapping(uint256 => Ticket) public tickets;
  uint256 ticketIdCounter;

  constructor(
    TicketChain _ticketChain,
    string memory _eventName,
    uint256 _eventDateTime,
    string memory _venue,
    uint256 _openSaleTime,
    uint256 _closingSaleTime
  ) public {
    OWNER = msg.sender;
    ticketChain = _ticketChain;
    eventName = _eventName;
    eventDateTime = _eventDateTime;
    venue = _venue;
    openSaleTime = _openSaleTime;
    closingSaleTime = _closingSaleTime;
  }

  modifier onlyOwner() {
    require(msg.sender == OWNER, "msg.sender is not OWNER");
    _;
  }

  modifier onlyTicketOwner(uint256 ticketId) {
    require(msg.sender == tickets[ticketId].currOwner, "msg.sender is not ticket owner");
    _;
  }

  modifier initialised() {
    require(eventIdSet, "event not initialise");
    _;
  }

  function() external payable {}

  function initialise() public onlyOwner returns (uint256) {
    eventId = ticketChain.newEvent();
    eventIdSet = true;
    return eventId;
  }

  function isEventTicket() public pure returns (bool) {
    return true;
  }

  function mint(uint256 price, uint256 seatNumber)
    public
    onlyOwner
    initialised
    returns (uint256)
  {
    require(!isListed);
    ticketIdCounter++;
    Ticket memory newTicket = Ticket(
      ticketIdCounter,
      price,
      seatNumber,
      address(this),
      address(this)
    );
    tickets[ticketIdCounter] = newTicket;
    return newTicket.ticketId;
  }

  function massMint(uint256 price, uint256 seatNumberStart, uint256 quantity)
    public
    onlyOwner
    initialised
  {
    require(!isListed, "Tickets listed already");
    Ticket memory newTicket;
    for (uint256 i = 0; i < quantity; i++) {
      ticketIdCounter++;
      newTicket = Ticket(
        ticketIdCounter,
        price,
        seatNumberStart + i,
        address(this),
        address(this)
      );
      tickets[ticketIdCounter] = newTicket;
    }
  }

  function transfer(uint256 ticketId)
    public
    initialised
    onlyTicketOwner(ticketId)
  {
    tickets[ticketId].prevOwner = tickets[ticketId].currOwner;
    tickets[ticketId].currOwner = address(ticketChain);
  }

  function massList() public initialised onlyOwner {
    require(!isListed, "Tickets listed already");
    for (uint256 i = 1; i <= ticketIdCounter; i++) {
      tickets[i].currOwner = address(ticketChain);
      ticketChain.list(eventId, i, tickets[i].originalPrice, tickets[i].seatNumber);
    }
    isListed = true;
  }

  function transferTo(uint256 ticketId, address newOwner)
    public
    initialised
    onlyTicketOwner(ticketId)
  {
    require(msg.sender == address(ticketChain), "msg.sender is not TicketChain");
    tickets[ticketId].prevOwner = tickets[ticketId].currOwner;
    tickets[ticketId].currOwner = newOwner;
  }

  function burn(uint256 ticketId) public onlyOwner {
    delete tickets[ticketId];
  }

  function withdraw() public onlyOwner {
    msg.sender.transfer(address(this).balance);
  }

  function updateEventName(string memory _eventName) public onlyOwner {
    require(!isListed, "Tickets listed already");
    eventName = _eventName;
  }

  function updateEventDateTime(uint256 _eventDateTime) public onlyOwner {
    require(!isListed, "Tickets listed already");
    eventDateTime = _eventDateTime;
  }

  function updateVenue(string memory _venue) public onlyOwner {
    require(!isListed, "Tickets listed already");
    venue = _venue;
  }

  function updateOpenSaleTime(uint256 _openSaleTime) public onlyOwner {
    require(!isListed, "Tickets listed already");
    openSaleTime = _openSaleTime;
  }

  function updateClosingSaleTime(uint256 _closingSaleTime) public onlyOwner {
    require(!isListed, "Tickets listed already");
    closingSaleTime = _closingSaleTime;
  }

  function getTotalTickets() public view returns (uint256) {
    return ticketIdCounter;
  }

  function getCurrOwner(uint256 ticketId) public view returns (address) {
    return tickets[ticketId].currOwner;
  }

  function getPrevOwner(uint256 ticketId) public view returns (address) {
    return tickets[ticketId].prevOwner;
  }

  function getOriginalPrice(uint256 ticketId) public view returns (uint256) {
    return tickets[ticketId].originalPrice;
  }

  function getIsListed() public view returns (bool) {
    return isListed;
  }

  function getEventIdSet() public view returns (bool) {
    return eventIdSet;
  }

  function getEvent()
    public
    view
    returns (
      uint256,
      string memory,
      uint256,
      string memory,
      uint256,
      uint256,
      bool
    )
  {
    return (
      eventId,
      eventName,
      eventDateTime,
      venue,
      openSaleTime,
      closingSaleTime,
      isListed
    );
  }
}
