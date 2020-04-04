pragma solidity ^0.5.0;

import './TicketChain.sol';

contract EventTicket {
    address OWNER;
    TicketChain ticketChain;
    uint public eventId;
    string public eventName;
    uint public eventDateTime;
    string public venue;
    uint public openSaleTime;
    uint public closingSaleTime;
    bool isListed = false;
    bool eventIdSet = false;

    struct Ticket {
        uint ticketId;
        uint originalPrice;
        uint seatNumber;
        address currOwner;
        address prevOwner;
    }

    mapping(uint => Ticket) tickets;
    uint ticketIdCounter;

    constructor(
        TicketChain _ticketChain,
        string memory _eventName,
        uint _eventDateTime,
        string memory _venue,
        uint _openSaleTime,
        uint _closingSaleTime
    )
        public
    {
        OWNER = msg.sender;
        ticketChain = _ticketChain;
        eventName = _eventName;
        eventDateTime = _eventDateTime;
        venue = _venue;
        openSaleTime = _openSaleTime;
        closingSaleTime = _closingSaleTime;
    }

    modifier onlyOwner() {
        require(msg.sender == OWNER);
        _;
    }

    modifier onlyTicketOwner(uint ticketId) {
        require(msg.sender == tickets[ticketId].currOwner);
        _;
    }

    modifier initialised() {
        require(eventIdSet);
        _;
    }

    function() external payable {}

    function initialise() public onlyOwner returns (uint) {
        eventId = ticketChain.newEvent();
        eventIdSet = true;
    }

    function isEventTicket() public pure returns (bool) {
        return true;
    }

    function mint(uint price, uint seatNumber)
        public
        onlyOwner
        initialised
        returns (uint)
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

    function massMint(uint price, uint seatNumberStart, uint quantity)
        public
        onlyOwner
        initialised
    {
        require(!isListed);
        Ticket memory newTicket;
        for (uint i = 0; i < quantity; i++) {
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

    function transfer(uint ticketId)
        public
        initialised
        onlyTicketOwner(ticketId)
    {
        tickets[ticketId].prevOwner = tickets[ticketId].currOwner;
        tickets[ticketId].currOwner = address(ticketChain);
    }

    function massList() public initialised onlyOwner {
        require(!isListed);
        for (uint i = 1; i <= ticketIdCounter; i++) {
            tickets[i].currOwner = address(ticketChain);
            ticketChain.list(eventId, i, tickets[i].originalPrice);
        }
        isListed = true;
    }

    function transferTo(uint ticketId, address newOwner)
        public
        initialised
        onlyTicketOwner(ticketId)
    {
        require(msg.sender == address(ticketChain));
        tickets[ticketId].prevOwner = tickets[ticketId].currOwner;
        tickets[ticketId].currOwner = newOwner;
    }

    function burn(uint ticketId) public onlyOwner {
        delete tickets[ticketId];
    }

    function withdraw() public onlyOwner {
        msg.sender.transfer(address(this).balance);
    }

    function updateEventName(string memory _eventName) public onlyOwner {
        require(!isListed);
        eventName = _eventName;
    }

    function updateEventDateTime(uint _eventDateTime) public onlyOwner {
        require(!isListed);
        eventDateTime = _eventDateTime;
    }

    function updateVenue(string memory _venue) public onlyOwner {
        require(!isListed);
        venue = _venue;
    }

    function updateOpenSaleTime(uint _openSaleTime) public onlyOwner {
        require(!isListed);
        openSaleTime = _openSaleTime;
    }

    function updateClosingSaleTime(uint _closingSaleTime) public onlyOwner {
        require(!isListed);
        closingSaleTime = _closingSaleTime;
    }

    function getTotalTickets() public view returns (uint) {
        return ticketIdCounter;
    }

    function getCurrOwner(uint ticketId) public view returns (address) {
        return tickets[ticketId].currOwner;
    }

    function getPrevOwner(uint ticketId) public view returns (address) {
        return tickets[ticketId].prevOwner;
    }

    function getOriginalPrice(uint ticketId) public view returns (uint) {
        return tickets[ticketId].originalPrice;
    }

    function getEvent() public view
        returns (uint, string memory, uint, string memory, uint, uint) {
        return (
            eventId,
            eventName,
            eventDateTime,
            venue,
            openSaleTime,
            closingSaleTime
        );
    }

    function getTicket(uint _ticketId) public view
        returns (
            uint ticketId,
            uint originalPrice,
            uint seatNumber,
            address currOwner,
            address prevOwner
        )
    {
        Ticket memory ticket = tickets[_ticketId];
        return (
            ticket.ticketId,
            ticket.originalPrice,
            ticket.seatNumber,
            ticket.currOwner,
            ticket.prevOwner
        );
    }
}
