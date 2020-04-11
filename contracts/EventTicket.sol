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
    require(msg.sender == OWNER, "Only owner of EventTicket contract can call");
    _;
  }

  modifier onlyTicketOwner(uint256 ticketId) {
    require(msg.sender == tickets[ticketId].currOwner, "Only the ticket owner can call");
    _;
  }

  modifier initialised() {
    require(eventIdSet, "EventIdSet not yet initialised to true");
    _;
  }

  function() external payable {}

  function initialise() public onlyOwner returns (uint256) {
    eventId = ticketChain.newEvent();
    eventIdSet = true;
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
    require(!isListed);
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
    require(!isListed);
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
    require(msg.sender == address(ticketChain));
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
    require(!isListed);
    eventName = _eventName;
  }

  function updateEventDateTime(uint256 _eventDateTime) public onlyOwner {
    require(!isListed);
    eventDateTime = _eventDateTime;
  }

  function updateVenue(string memory _venue) public onlyOwner {
    require(!isListed);
    venue = _venue;
  }

  function updateOpenSaleTime(uint256 _openSaleTime) public onlyOwner {
    require(!isListed);
    openSaleTime = _openSaleTime;
  }

  function updateClosingSaleTime(uint256 _closingSaleTime) public onlyOwner {
    require(!isListed);
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
