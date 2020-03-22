pragma solidity ^0.5.0;

import './TicketChain.sol';

contract EventTicket {
    address OWNER;
    TicketChain ticketChain;
    uint public eventId;
    bool isListed = false;
    bool eventIdSet = false;

    struct Ticket {
        uint ticketId;
        uint originalPrice;
        string eventName;
        uint eventDateTime;
        string venue;
        uint seatNumber;
        uint openSaleTime;
        uint closingSaleTime;
        address currOwner;
        address prevOwner;
    }

    mapping(uint => Ticket) tickets;
    uint ticketIdCounter;

    constructor(TicketChain tcAddress) public {
        OWNER = msg.sender;
        ticketChain = tcAddress;
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

    function initialise() public onlyOwner returns(uint) {
        eventId = ticketChain.newEvent();
        eventIdSet = true;
    }

    function isEventTicket() public pure returns(bool) {
        return true;
    }

    function mint(
        uint price,
        string memory eventName,
        uint eventDateTime,
        string memory venue,
        uint seatNumber,
        uint openSaleTime,
        uint closingSaleTime
    ) public onlyOwner initialised returns (uint) {
        require(!isListed);
        ticketIdCounter++;
        Ticket memory newTicket = Ticket(
            ticketIdCounter,
            price,
            eventName,
            eventDateTime,
            venue,
            seatNumber,
            openSaleTime,
            closingSaleTime,
            address(this),
            address(this)
        );
        tickets[ticketIdCounter] = newTicket;
        return newTicket.ticketId;
    }

    function massMint(
        uint price,
        string memory eventName,
        uint eventDateTime,
        string memory venue,
        uint seatNumberStart,
        uint openSaleTime,
        uint closingSaleTime,
        uint quantity
    ) public onlyOwner initialised {
        require(!isListed);
        Ticket memory newTicket;
        for (uint i = 0; i < quantity; i++) {
            ticketIdCounter++;
            newTicket = Ticket(
                ticketIdCounter,
                price,
                eventName,
                eventDateTime,
                venue,
                seatNumberStart + i,
                openSaleTime,
                closingSaleTime,
                address(this),
                address(this)
            );
            tickets[ticketIdCounter] = newTicket;
        }
    }

    function transfer(uint ticketId) public initialised onlyTicketOwner(ticketId) {
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

    function transferTo(
        uint ticketId,
        address newOwner
    ) public initialised onlyTicketOwner(ticketId) {
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

    function getTotalTickets() public view returns(uint) {
        return ticketIdCounter;
    }

    function getCurrOwner(uint ticketId) public view returns(address) {
        return tickets[ticketId].currOwner;
    }

    function getPrevOwner(uint ticketId) public view returns(address) {
        return tickets[ticketId].prevOwner;
    }

    function getOriginalPrice(uint ticketId) public view returns(uint) {
        return tickets[ticketId].originalPrice;
    }

    function getOpenSaleTime(uint ticketId) public view returns(uint) {
        return tickets[ticketId].openSaleTime;
    }

    function getClosingSaleTime(uint ticketId) public view returns(uint) {
        return tickets[ticketId].closingSaleTime;
    }
}
