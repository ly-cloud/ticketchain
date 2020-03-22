pragma solidity ^0.5.0;

import './EventTicket.sol';
// import './LoyaltyCoin.sol';

contract TicketChain {
    address OWNER;
    // LoyaltyCoin loyaltyCoin;
    uint commission;
    uint rate;
    uint redeemRate;
    uint eventIdCounter;

    mapping(uint => EventTicket) events;

    constructor() public {
        // loyaltyCoin = lcAddress;
        OWNER = msg.sender;
    }

    struct Listing {
    	address seller;
        uint price;
        bool listed;
    }

    mapping(uint => mapping(uint => Listing)) private ticketsListing;


    modifier onlyOwner() {
        require(msg.sender == OWNER);
        _;
    }

    modifier validEvent(uint eventId) {
        require(eventId <= eventIdCounter);
        _;
    }

    modifier onlyTicketOwner(uint eventId, uint ticketId) {
        EventTicket eventTicket = events[eventId];
        require(msg.sender == eventTicket.getPrevOwner(ticketId));
        require(address(this) == eventTicket.getCurrOwner(ticketId));
        _;
    }

    function newEvent() public returns(uint) {
        EventTicket etContract = EventTicket(msg.sender);
        require(etContract.isEventTicket());
        eventIdCounter++;
        events[eventIdCounter] = etContract;
        return eventIdCounter;
    }

    function list(
        uint eventId,
        uint ticketId,
        uint price
    ) public validEvent(eventId) onlyTicketOwner(eventId, ticketId) {
        require(!ticketsListing[eventId][ticketId].listed);
        EventTicket eventTicket = events[eventId];
        require(price <= eventTicket.getOriginalPrice(ticketId));

        Listing memory newListing = Listing(msg.sender, price, true);
        ticketsListing[eventId][ticketId] = newListing;
    }

    function updatePrice(
        uint eventId,
        uint ticketId,
        uint newPrice
    ) public validEvent(eventId) onlyTicketOwner(eventId, ticketId) {
        require(ticketsListing[eventId][ticketId].listed);
        EventTicket eventTicket = events[eventId];
        require(newPrice <= eventTicket.getOriginalPrice(ticketId));

        ticketsListing[eventId][ticketId].price = newPrice;
    }

    function unlist(
        uint eventId,
        uint ticketId
    ) public validEvent(eventId) onlyTicketOwner(eventId, ticketId) {
        EventTicket eventTicket = events[eventId];
        delete ticketsListing[eventId][ticketId];
        eventTicket.transferTo(ticketId, msg.sender);
    }

    function buy(
        uint eventId,
        uint ticketId
        // uint loyalty
    ) public payable validEvent(eventId) {
        require(ticketsListing[eventId][ticketId].listed);
        EventTicket eventTicket = events[eventId];
        require(msg.value >= ticketsListing[eventId][ticketId].price);
        require(
            block.timestamp >= eventTicket.getOpenSaleTime(ticketId)
            && block.timestamp < eventTicket.getClosingSaleTime(ticketId)
        );

        address payable recipient = address(
            uint160(eventTicket.getPrevOwner(ticketId))
        );
        eventTicket.transferTo(ticketId, msg.sender);
        recipient.transfer(msg.value - commission);
    }

    function getListingPrice(
        uint eventId,
        uint ticketId
    ) public view validEvent(eventId) returns(uint) {
        require(ticketsListing[eventId][ticketId].listed);
        return ticketsListing[eventId][ticketId].price;
    }

    function getRedeemRate() public view returns(uint) {
        return redeemRate;
    }

    function setRedeemRate(uint conversion) public onlyOwner {
        redeemRate = conversion;
    }

    function getRate() public view returns(uint) {
        return rate;
    }

    function setRate(uint amount) public onlyOwner {
        rate = amount;
    }

    function getCommission() public view returns(uint) {
        return commission;
    }

    function setCommission(uint value) public onlyOwner {
        commission = value;
    }

    function withdraw() public onlyOwner {
        msg.sender.transfer(address(this).balance);
    }
}
