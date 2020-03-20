pragma solidity ^0.5.0;

import './TicketChain.sol';

contract EventTicket {
    address OWNER;
    TicketChain ticketChain;
    uint public eventId;

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
        eventId = ticketChain.newEvent();
    }

    modifier onlyOwner() {
        require(msg.sender == OWNER);
        _;
    }

    modifier onlyTicketChain() {
        require(msg.sender == address(ticketChain));
        _;
    }

    modifier onlyTicketOwner(uint ticketId) {
        require(msg.sender == tickets[ticketId].currOwner);
    }

    function isEventTicket() public view returns(bool) {
        return true;
    }

    function mint(
        uint price,
        string eventName,
        uint eventDateTime,
        string venue,
        uint seatNumber,
        uint openSaleTime,
        uint closingSaleTime
    ) onlyOwner returns (uint) {
        ticketIdCounter++;
        Ticket memory newTicket = Ticket(
            ticketIdCounter,
            price,
            eventName,
            eventDateTime,
            venue,
            seatNumber,
            openSaleTime,
            closingSaleTime
            address(this),
            address(this)
        );
        tickets[ticketId] = newTicket;
        return newTicket.ticketId;
    }

    function massMint(
        uint price,
        string eventName,
        uint eventDateTime,
        string venue,
        uint seatNumberStart,
        uint openSaleTime,
        uint closingSaleTime,
        uint quantity
    ) onlyOwner {
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
            tickets[ticketId] = newTicket;
        }
    }

    function transfer(uint ticketId) public onlyTicketOwner(ticketId) {
        tickets[ticketId].prevOwner = tickets[ticketId].owner;
        tickets[ticketId].owner = address(ticketChain);
    }

    function massList() public onlyOwner {
        // for (uint i = 1; i <= ticketIdCounter; i++) {
        //     // transfer all tickets in contract to ticketChain
        //     // call ticketChain to create listing for each
        // }
    }

    function transferTo(
        uint ticketId,
        address newOwner
    ) onlyTicketChain onlyTicketOwner(ticketId) public {
        tickets[ticketId].prevOwner = tickets[ticketId].owner;
        tickets[ticketId].owner = newOwner;
    }

    function burn(uint ticketId) public onlyOwner {
        delete tickets[ticketId];
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
